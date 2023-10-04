from flask import *
import Views.response as responses
import requests
import Models.orders as orders
from datetime import datetime


def build_payment(user):
    data = request.get_json()
    user_id = user["data"]["id"]
    now = datetime.now()
    order_number = now.strftime("%Y%m%d%H%M%S")
    db_status, order_id = orders.create_order(order_number, user_id, data)
    if db_status == 200:
        tap_data = {
            "prime": data["prime"],
            "partner_key": "partner_W6Iek1ERpiElsds3g764mKMUjROeMd88GBiOgTn9QeQNhx6B402ilxqb",
            "merchant_id": "chen_CTBC",
            "details": "TapPay Test",
            "amount": data["order"]["price"],
            "cardholder": {
                "phone_number": data["contact"]["phone"],
                "name": data["contact"]["name"],
                "email": data["contact"]["email"],
            },
        }

        headers = {
            "Content-Type": "application/json",
            "x-api-key": "partner_W6Iek1ERpiElsds3g764mKMUjROeMd88GBiOgTn9QeQNhx6B402ilxqb",
        }

        # 發送 POST 請求
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        response = requests.post(url, json=tap_data, headers=headers)
        response_data = json.loads(response.text)

        if response_data["status"] == 0:
            orders.update_payment_status(order_id)

            success_message = {
                "data": {
                    "number": order_id,
                    "payment": {"status": 0, "message": "付款成功"},
                }
            }

        else:
            success_message = {
                "data": {
                    "number": order_id,
                    "payment": {"status": 0, "message": "付款失敗"},
                }
            }
        return responses.create_success_response(success_message, 200)

    else:
        # 處理錯誤情況
        error_message = {"error": True}
        return responses.create_error_response(error_message, 400)


def get_payment(order_id):
    payment_data = orders.get_payment_to_db(order_id)
    number = payment_data["order_id"]
    price = json.loads(payment_data["order_description"])["price"]
    trip = json.loads(payment_data["order_description"])["trip"]
    contact = json.loads(payment_data["contact"])

    success_message = {
        "data": {"number": number, "price": price, "trip": trip, "contact": contact},
        "status": 1,
    }
    return responses.create_success_response(success_message, 200)


# {'order_id': 20231003233257, 'order_description': '{"price": 2000, "trip": {"attraction": {"id": "1", "name": "\\u65b0\\u5317\\u6295\\u6eab\\u6cc9\\u5340", "address": "\\u81fa\\u5317\\u5e02  \\u5317\\u6295\\u5340\\u4e2d\\u5c71\\u8def\\u3001\\u5149\\u660e\\u8def\\u6cbf\\u7dda", "image": "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000848.jpg"}}, "date": "morning", "time": "2023-09-30"}', 'contact': '{"name": "aaa", "email": "aaa@bbb.cc", "phone": "1234567890"}'}
