from flask import *
import json
from dbcrud import *

apibp = Blueprint("api_route", __name__)


@apibp.route("/attractions")
def get_attractions():
    pass


# 網頁呈現ascii，要設定為utf-8
@apibp.route("/mrts")
def get_mrts():
    result = get_mrts_attractions()
    attractions_count = {}
    for item in result:
        mrt = item["mrt"]

        if mrt in attractions_count:
            attractions_count[mrt] += 1
        else:
            attractions_count[mrt] = 1
    sorted_attractions = sorted(
        attractions_count.items(), key=lambda x: x[1], reverse=True
    )
    top_40 = []
    data = {"data": top_40}
    for sort in range(0, len(sorted_attractions[:40])):
        top_40.append(sorted_attractions[sort][0])
    json_string = json.dumps(data, ensure_ascii=False)
    return (
        json_string,
        200,
        {"Content-Type": "application/json; charset=utf-8"},
    )
