from flask import *
import json
from dbcrud import *


apibp = Blueprint("api_route", __name__)


@apibp.route("/attractions")
def get_attractions():
    try:
        page = request.args.get("page", type=int, default=0)
        per_page = 12

        keyword = request.args.get("keyword", None)

        result = get_all_attractions(keyword, page, per_page)

        result_list = [dict(row) for row in result[:per_page]]

        for item in result_list:
            item["images"] = json.loads(item["images"])

        next_page = page + 1 if len(result) > per_page else None

        json_string = json.dumps(
            {"nextPage": next_page, "data": result_list}, ensure_ascii=False
        )

        return (
            json_string,
            200,
            {"Content-Type": "application/json; charset=utf-8"},
        )

    except Exception:
        error_message = {"error": True, "message": "伺服器異常"}
        return (
            jsonify(error_message),
            500,
            {"Content-Type": "application/json; charset=utf-8"},
        )


@apibp.route("/attraction/<attractionId>")
def get_attraction_byid(attractionId):
    try:
        result = get_attraction_withid(attractionId)
        image_list = json.loads(result["images"])
        result["images"] = image_list
        json_string = json.dumps({"data": result}, ensure_ascii=False)
        return (
            json_string,
            200,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    except ValueError:
        error_message = {"error": True, "message": "編號錯誤"}
        return (
            jsonify(error_message),
            400,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    except Exception:
        error_message = {"error": True, "message": "伺服器異常"}
        return (
            jsonify(error_message),
            500,
            {"Content-Type": "application/json; charset=utf-8"},
        )


# 網頁呈現ascii，要設定為utf-8
@apibp.route("/mrts")
def get_mrts():
    try:
        result = get_mrts_attractions()
        data = {"data": result}
        return (
            data,
            200,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    except Exception:
        error_message = {"error": True, "message": "伺服器異常"}
        return (
            jsonify(error_message),
            500,
            {"Content-Type": "application/json; charset=utf-8"},
        )
