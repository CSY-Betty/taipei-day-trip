from flask import *
import Views.response as responses
import Models.bookings as bookings_todb
from datetime import date, datetime


def create_booking(user_id, data):
    status_code, result = bookings_todb.create_booking_to_db(user_id, data)
    if status_code == 200:
        success_message = {"ok": True}
        return responses.create_success_response(success_message, 200)

    else:
        error_message = "建立失敗，輸入異常"
        return responses.create_error_response(error_message, 400)


def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


def get_bookings(user_id):
    status_code, result = bookings_todb.search_booking_to_db(user_id)

    if result is not None and len(result) > 0:
        images = json.loads(result[0]["images"])
        date = json_serial(result[0]["date"])
        success_message = {
            "data": {
                "attraction": {
                    "id": result[0]["attraction_id"],
                    "name": result[0]["name"],
                    "address": result[0]["address"],
                    "image": images[0],
                },
                "date": date,
                "time": result[0]["time"],
                "price": result[0]["price"],
            }
        }
    else:
        success_message = None

    return responses.create_success_response(success_message, status_code)


def delete_booking(user_id, attraction_id):
    try:
        status_code, result = bookings_todb.delete_booking_to_db(user_id, attraction_id)

        success_message = {"ok": True}
        return responses.create_success_response(success_message, status_code)

    except:
        error_message = "刪除異常"
        return responses.create_error_response(error_message, 500)
