from flask import *
import jwt
from datetime import datetime, timedelta
import Models.users as users
import Views.response as responses


def signup_controll():
    data = request.get_json()
    result = users.signup_to_db(data)

    if result == 200:
        success_message = {"ok": True}
        return responses.create_success_response(success_message, result)
    elif result == 400:
        error_message = "註冊失敗，重複的 Email 或其他原因"
        return responses.create_error_response(error_message, result)
    else:
        error_message = "伺服器內部錯誤"
        return responses.create_error_response(error_message, result)


def signin_controll():
    data = request.get_json()
    result = users.signin_to_db(data)

    if result[0] == 200:
        payload = {
            "id": result[1]["id"],
            "name": result[1]["name"],
            "email": result[1]["email"],
            "exp": datetime.utcnow() + timedelta(days=7),
        }
        encoded_jwt = jwt.encode(
            payload,
            "key123",
            algorithm="HS256",
        )
        success_message = {"token": encoded_jwt}
        return responses.create_success_response(success_message, result[0])

    elif result[0] == 400:
        error_message = "登入失敗，帳號或密碼錯誤"
        return responses.create_error_response(error_message, result[0])
    else:
        error_message = "伺服器內部錯誤"
        return responses.create_error_response(error_message, result)


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
        return responses.create_success_response(success_message, 200)
    except jwt.ExpiredSignatureError:
        error_message = "Signature has expired."
        return responses.create_error_response(error_message, 401)
