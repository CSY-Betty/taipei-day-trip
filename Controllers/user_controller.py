from flask import *
import jwt
from datetime import datetime, timedelta
import Models.users as users
import Views.response as response


def signup_controll():
    data = request.get_json()
    result = users.signup_to_db(data)

    if result == 200:
        success_message = {"ok": True}
        return response.create_success_response(success_message, result)
    elif result == 400:
        error_message = "註冊失敗，重複的 Email 或其他原因"
        return response.create_error_response(error_message, result)
    else:
        error_message = "伺服器內部錯誤"
        return response.create_error_response(error_message, result)


def signin_controll():
    data = request.get_json()
    status_code = users.signin_to_db(data)

    if status_code == 200:
        payload = {
            "email": data["email"],
            "password": data["password"],
            "exp": datetime.utcnow() + timedelta(days=7),
        }
        encoded_jwt = jwt.encode(
            payload,
            "key123",
            algorithm="HS256",
        )
        success_message = {"token": encoded_jwt}
        response = response.create_success_response(success_message, status_code)
        response.headers["Authorization"] = encoded_jwt
        return response

    elif status_code == 400:
        error_message = "登入失敗，帳號或密碼錯誤"
        return response.create_error_response(error_message, status_code)
    else:
        error_message = "伺服器內部錯誤"
        return response.create_error_response(error_message, status_code)


def auth_controll():
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")

    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
        result = users.auth_to_db(decoded_jwt)
        success_message = {
            "data": {
                "id": result[1]["id"],
                "name": result[1]["name"],
                "email": result[1]["email"],
            }
        }
        return response.create_success_response(success_message, 200)
    except jwt.ExpiredSignatureError:
        error_message = "Signature has expired."
        return response.create_error_response(error_message, 401)
