from flask import *
from Controllers.attraction_controller import (
    generate_attractions,
    generate_one_of_the_attractions,
    generate_mrts,
)
from Controllers.user_controller import signup_controll, signin_controll, auth_controll


apibp = Blueprint("api_route", __name__)


@apibp.route("/attractions")
def get_attractions():
    return generate_attractions()


@apibp.route("/attraction/<attractionId>")
def get_one_of_the_attractions(attractionId):
    return generate_one_of_the_attractions(attractionId)


@apibp.route("/mrts")
def get_mrts():
    return generate_mrts()


@apibp.route("/user", methods=["POST"])
def signup():
    return signup_controll()


@apibp.route("/user/auth", methods=["PUT"])
def signin():
    return signin_controll()


@apibp.route("/user/auth", methods=["GET"])
def auth():
    return auth_controll()
