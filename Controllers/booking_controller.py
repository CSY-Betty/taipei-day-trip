from flask import *
import Views.response as responses
import Models.bookings as bookings_todb


def create_booking(user):
    data = request.get_json()
    try:
        session["user_id"] = user["data"]["id"]
        session["attraction_id"] = data["attractionId"]
        session["attraction_name"] = data["attractionName"]
        session["atteaction_address"] = data["attractionAddress"]
        session["date"] = data["date"]
        session["time"] = data["time"]
        session["price"] = data["price"]
        session["attractionImage"] = data["attractionImage"]
        # <SecureCookieSession {'atteaction_address': '臺北市  北投區中山路、光明路沿線', 'attractionImage': 'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000848.jpg', 'attraction_id': '1', 'attraction_name': '新北投溫泉區', 'date': '2023-09-30', 'id': 11, 'price': 2000, 'time': 'morning', 'user_id': 11}>

        success_message = {"ok": True}
        return responses.create_success_response(success_message, 200)

    except:
        error_message = "建立失敗，輸入異常"
        return responses.create_error_response(error_message, 400)


def get_bookings():
    if "user_id" in session:
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


def delete_booking():
    try:
        session.clear()

        success_message = {"ok": True}
        return responses.create_success_response(success_message, 200)

    except:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)
