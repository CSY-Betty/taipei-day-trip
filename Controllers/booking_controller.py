from flask import *
import json
import jwt

# from datetime import date
import Models.bookings as bookings
import Views.response as responses


def create_booking():
    data = request.get_json()
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")
    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
        result = bookings.create_booking_to_db(data, decoded_jwt)

        if result == 200:
            success_message = {"ok": True}
            return responses.create_success_response(success_message, result)

        elif result == 400:
            error_message = "建立失敗，輸入不正確或其他原因"
            return responses.create_error_response(error_message, result)
        elif result == 500:
            error_message = "伺服器內部錯誤"
            return responses.create_error_response(error_message, result)

    except jwt.ExpiredSignatureError:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)


def get_bookings():
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")
    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
        result = bookings.search_booking_to_db(decoded_jwt)
        if result:
            images = json.loads(result[0]["images"])
            first_image = images[0]
            date = result[0]["date"].strftime("%Y-%m-%d")

            success_message = {
                "data": {
                    "attraction": {
                        "id": result[0]["attraction_id"],
                        "name": result[0]["name"],
                        "address": result[0]["address"],
                        "image": first_image,
                    },
                    "date": date,
                    "time": result[0]["time"],
                    "price": result[0]["price"],
                }
            }
        else:
            success_message = None

        return responses.create_success_response(success_message, 200)

    except jwt.ExpiredSignatureError:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)


def delete_booking():
    data = request.get_json()
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")
    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")

        user_id = decoded_jwt["id"]
        attraction_id = data
        result = bookings.delete_booking_to_db(user_id, attraction_id)

        if result == 200:
            success_message = {"ok": True}
            return responses.create_success_response(success_message, 200)
        else:
            error_message = "伺服器內部錯誤"
            return responses.create_error_response(error_message, result)

    except jwt.ExpiredSignatureError:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)
