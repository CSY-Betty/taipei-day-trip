from flask import *
from Models.attractions import *
from Views.response import *


def generate_attractions():
    try:
        page = request.args.get("page", type=int, default=0)
        per_page = 12

        keyword = request.args.get("keyword", None)

        result = get_all_attractions(keyword, page, per_page)

        result_list = [dict(row) for row in result[:per_page]]

        for item in result_list:
            item["images"] = json.loads(item["images"])

        next_page = page + 1 if len(result) > per_page else None
        success_message = {"nextPage": next_page, "data": result_list}

        return create_success_response(success_message, 200)

    except Exception:
        error_message = "伺服器異常"
        return create_error_response(error_message, 500)


def generate_one_of_the_attractions(attractionId):
    try:
        result = get_attraction_withid(attractionId)
        image_list = json.loads(result["images"])
        result["images"] = image_list

        success_message = {"data": result}
        return create_success_response(success_message, 200)

    except ValueError:
        error_message = "編號錯誤"
        return create_error_response(error_message, 400)

    except Exception:
        error_message = "伺服器異常"
        return create_error_response(error_message, 500)


def generate_mrts():
    try:
        result = get_mrts_attractions()
        success_message = {"data": result}
        return create_success_response(success_message, 200)
    except Exception:
        error_message = "伺服器異常"
        return create_error_response(error_message, 500)
