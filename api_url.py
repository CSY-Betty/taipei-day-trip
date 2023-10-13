from flask import *
import Controllers.attraction_controller as control_attraction
import Controllers.user_controller as control_user
import Controllers.booking_controller as control_booking
import Controllers.order_controller as control_order
import Views.response as responses

apibp = Blueprint("api_route", __name__)


@apibp.route("/attractions")
def get_attractions():
    return control_attraction.generate_attractions()


@apibp.route("/attraction/<attractionId>")
def get_one_of_the_attractions(attractionId):
    return control_attraction.generate_one_of_the_attractions(attractionId)


@apibp.route("/mrts")
def get_mrts():
    return control_attraction.generate_mrts()


@apibp.route("/user", methods=["POST"])
def signup():
    return control_user.signup_controll()


@apibp.route("/user/auth", methods=["PUT"])
def signin():
    return control_user.signin_controll()


@apibp.route("/user/auth", methods=["POST"])
def auth():
    return control_user.auth_controll()


@apibp.route("/booking", methods=["GET", "POST", "DELETE"])
def booking():
    auth = control_user.auth_controll()

    if auth.status_code == 200:
        user = auth.response
        # b'{"data": {"id": 11, "name": "aaa", "email": "aaa@bbb.cc"}}'
        user_decode = json.loads(user[0].decode("utf-8"))
        user_id = user_decode["data"]["id"]

        if request.method == "GET":
            return control_booking.get_bookings(user_id)
        elif request.method == "POST":
            data = request.get_json()
            return control_booking.create_booking(user_id, data)
        elif request.method == "DELETE":
            data = request.get_json()
            return control_booking.delete_booking(user_id, data)
    else:
        error_message = "未登入系統，拒絕存取"
        return responses.create_error_response(error_message, 403)


@apibp.route("/orders", methods=["POST"])
def order():
    auth = control_user.auth_controll()
    if auth.status_code == 200:
        data = auth.response
        # b'{"data": {"id": 11, "name": "aaa", "email": "aaa@bbb.cc"}}'
        data_decode = json.loads(data[0].decode("utf-8"))
        return control_order.build_payment(data_decode)


@apibp.route("/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    auth = control_user.auth_controll()
    if auth.status_code == 200:
        return control_order.get_payment(orderNumber)
