from flask import *
import jwt
from datetime import datetime, timedelta
import Models.users as users
import Views.response as responses


def signup_controll():
    data = request.get_json()
    status_code, result = users.signup_to_db(data)

    if status_code == 200:
        success_message = {"ok": True}
        return responses.create_success_response(success_message, status_code)
    elif status_code == 400:
        error_message = "註冊失敗，重複的 Email 或其他原因"
        return responses.create_error_response(error_message, status_code)
    else:
        error_message = "伺服器內部錯誤"
        return responses.create_error_response(error_message, status_code)


def encoded_jwt(user_data):
    payload = {
        "id": user_data["id"],
        "name": user_data["name"],
        "email": user_data["email"],
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    token = jwt.encode(
        payload,
        "key123",
        algorithm="HS256",
    )
    return token


def signin_controll():
    data = request.get_json()
    status_code, result = users.signin_to_db(data)

    if status_code == 200:
        token = encoded_jwt(result)
        success_message = {"token": token}
        return responses.create_success_response(success_message, status_code)

    elif status_code == 400:
        error_message = "登入失敗，帳號或密碼錯誤"
        return responses.create_error_response(error_message, status_code)
    else:
        error_message = "伺服器內部錯誤"
        return responses.create_error_response(error_message, status_code)


def decoded_jwt(token):
    user = jwt.decode(token, "key123", algorithms="HS256")
    return user


def auth_controll():
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")

    try:
        user = decoded_jwt(token)
        status_code, user_data = users.auth_to_db(user)
        success_message = {
            "data": {
                "id": user_data["id"],
                "name": user_data["name"],
                "email": user_data["email"],
            }
        }
        return responses.create_success_response(success_message, status_code)
    except jwt.ExpiredSignatureError:
        error_message = "Signature has expired."
        return responses.create_error_response(error_message, 401)
