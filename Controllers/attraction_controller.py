from flask import *
from Models.dbcrud import *
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
