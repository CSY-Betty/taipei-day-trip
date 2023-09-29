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

        session["user_id"] = decoded_jwt["id"]
        session["attraction_id"] = data["attractionId"]
        session["attraction_name"] = data["attractionName"]
        session["atteaction_address"] = data["attractionAddress"]
        session["date"] = data["date"]
        session["time"] = data["time"]
        session["price"] = data["price"]
        session["attractionImage"] = data["attractionImage"]
        # <SecureCookieSession {'atteaction_address': '臺北市  北投區中山路、光明路沿線', 'attractionImage': 'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000848.jpg', 'attraction_id': '1', 'attraction_name': '新北投溫泉區', 'date': '2023-09-30', 'id': 11, 'price': 2000, 'time': 'morning', 'user_id': 11}>
        print(session)
        # result = bookings.create_booking_to_db(data, decoded_jwt)

        # if session:
        success_message = {"ok": True}
        return responses.create_success_response(success_message, 200)

        # elif result == 400:
        #     error_message = "建立失敗，輸入不正確或其他原因"
        #     return responses.create_error_response(error_message, result)
        # elif result == 500:
        #     error_message = "伺服器內部錯誤"
        #     return responses.create_error_response(error_message, result)

    except jwt.ExpiredSignatureError:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)


def get_bookings():
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")
    try:
        decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
        # result = bookings.search_booking_to_db(decoded_jwt["id"])
        if "user_id" in session:
            # images = json.loads(result[0]["images"])
            # first_image = images[0]
            # date = result[0]["date"].strftime("%Y-%m-%d")

            # # success_message = {
            # #     "data": {
            # #         "attraction": {
            # #             "id": result[0]["attraction_id"],
            # #             "name": result[0]["name"],
            # #             "address": result[0]["address"],
            # #             "image": first_image,
            # #         },
            # #         "date": date,
            # #         "time": result[0]["time"],
            #         "price": result[0]["price"],
            #     }
            # }
            success_message = {
                "data": {
                    "attraction": {
                        "id": session["attraction_id"],
                        "name": session["attraction_name"],
                        "address": session["atteaction_address"],
                        "image": session["attractionImage"],
                    },
                    "date": session["date"],
                    "time": session["time"],
                    "price": session["price"],
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
        # result = bookings.delete_booking_to_db(user_id, attraction_id)
        session.clear()

        # if result == 200:
        success_message = {"ok": True}
        return responses.create_success_response(success_message, 200)
        # else:
        #     error_message = "伺服器內部錯誤"
        #     return responses.create_error_response(error_message, result)

    except jwt.ExpiredSignatureError:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)
