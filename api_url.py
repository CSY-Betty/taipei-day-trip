from flask import *
import Controllers.attraction_controller as control_attraction
import Controllers.user_controller as control_user
import Controllers.booking_controller as control_booking

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


@apibp.route("/user/auth", methods=["GET"])
def auth():
    return control_user.auth_controll()


@apibp.route("/booking", methods=["GET", "POST", "DELETE"])
def booking():
    if request.method == "GET":
        return control_booking.get_bookings()
    elif request.method == "POST":
        return control_booking.create_booking()
    elif request.method == "DELETE":
        return control_booking.delete_booking()
