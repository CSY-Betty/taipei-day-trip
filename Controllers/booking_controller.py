from flask import *
import jwt
import Models.bookings as bookings
import Views.response as responses


def create_booking():
    data = request.get_json()
    auth_header = request.headers.get("Authorization")
    token = auth_header.replace("Bearer ", "")
    decoded_jwt = jwt.decode(token, "key123", algorithms="HS256")
    result = bookings.create_booking_to_db(data, decoded_jwt)

    success_message = {"ok": True}
    status_code = 200
    return responses.create_success_response(success_message, status_code)
