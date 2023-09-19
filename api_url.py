from flask import *
import json
from dbcrud import *
import jwt
from datetime import datetime, timedelta


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


@apibp.route("/user", methods=["POST"])
def signup():
    data = request.get_json()
    result = signup_to_db(data)

    if result == 200:
        success_message = {"ok": True}
        return (
            jsonify(success_message),
            200,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    elif result == 400:
        error_message = "註冊失敗，重複的 Email 或其他原因"
        json_string = json.dumps(
            {"error": True, "message": error_message}, ensure_ascii=False
        )
        return (
            json_string,
            400,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    else:
        error_message = "伺服器內部錯誤"
        json_string = json.dumps(
            {"error": True, "message": error_message}, ensure_ascii=False
        )
        return (
            jsonify(error_message),
            500,
            {"Content-Type": "application/json; charset=utf-8"},
        )


@apibp.route("/user/auth", methods=["PUT"])
def signin():
    data = request.get_json()
    result = signin_to_db(data)

    if result == 200:
        encoded_jwt = jwt.encode(
            {
                "email": data["email"],
                "password": data["password"],
                "exp": datetime.utcnow() + timedelta(minutes=1),
            },
            "key123",
            algorithm="HS256",
        )
        success_message = {"token": encoded_jwt}

        response = make_response(jsonify(success_message), 200)
        response.headers["Authorization"] = encoded_jwt
        response.headers["Content-Type"] = "application/json; charset=utf-8"

        return response

    elif result == 400:
        error_message = "登入失敗，帳號或密碼錯誤"
        json_string = json.dumps(
            {"error": True, "message": error_message}, ensure_ascii=False
        )
        return (
            json_string,
            400,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    else:
        error_message = "伺服器內部錯誤"
        json_string = json.dumps(
            {"error": True, "message": error_message}, ensure_ascii=False
        )
        return (
            jsonify(error_message),
            500,
            {"Content-Type": "application/json; charset=utf-8"},
        )


@apibp.route("/user/auth", methods=["GET"])
def auth():
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")

    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
        result = auth_to_db(decoded_jwt)
        success_message = {
            "data": {
                "id": result[1]["id"],
                "name": result[1]["name"],
                "email": result[1]["email"],
            }
        }
        return (
            jsonify(success_message),
            200,
            {"Content-Type": "application/json; charset=utf-8"},
        )
    except jwt.ExpiredSignatureError:
        return ({"message": "Signature has expired."}, 401)
