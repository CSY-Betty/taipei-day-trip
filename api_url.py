from flask import *
import json
from Models.dbcrud import *
from Controllers.attraction_controller import generate_attractions
from Controllers.user_controller import signup_controll, signin_controll, auth_controll


apibp = Blueprint("api_route", __name__)


@apibp.route("/attractions")
def get_attractions():
    return generate_attractions()


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


@apibp.route("/user", methods=["POST"])
def signup():
    return signup_controll()


@apibp.route("/user/auth", methods=["PUT"])
def signin():
    return signin_controll()


@apibp.route("/user/auth", methods=["GET"])
def auth():
    return auth_controll()
