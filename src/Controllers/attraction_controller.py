from flask import *

import src.Models.attractions as attractions
import src.Views.response as response


def process_attractions_request():
    page = request.args.get("page", type=int, default=0)
    per_page = 12

    keyword = request.args.get("keyword", None)

    result = attractions.get_all_attractions(keyword, page, per_page)

    result_list = [dict(row) for row in result[:per_page]]

    for item in result_list:
        item["images"] = json.loads(item["images"])

    next_page = page + 1 if len(result) > per_page else None
    success_message = {"nextPage": next_page, "data": result_list}

    return success_message


def generate_attractions():
    try:
        success_message = process_attractions_request()
        return response.create_success_response(success_message, 200)
    except Exception:
        error_message = "伺服器異常"
        return response.create_error_response(error_message, 500)


def generate_one_of_the_attractions(attractionId):
    try:
        result = attractions.get_attraction_withid(attractionId)
        image_list = json.loads(result["images"])
        result["images"] = image_list

        success_message = {"data": result}
        return response.create_success_response(success_message, 200)

    except ValueError:
        error_message = "編號錯誤"
        return response.create_error_response(error_message, 400)

    except Exception:
        error_message = "伺服器異常"
        return response.create_error_response(error_message, 500)


def generate_mrts():
    try:
        result = attractions.get_mrts_attractions()
        success_message = {"data": result}
        return response.create_success_response(success_message, 200)
    except Exception:
        error_message = "伺服器異常"
        return response.create_error_response(error_message, 500)
