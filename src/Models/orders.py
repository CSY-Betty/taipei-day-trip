import Models.sqlcon as sql_connect
import json


def create_order(order_number, user_id, data):
    data_order = json.dumps(data["order"])
    data_contact = json.dumps(data["contact"])
    SQL = "INSERT INTO orders(order_id, user_id, order_description, contact) VALUES(%s, %s, %s, %s)"
    values = (order_number, user_id, data_order, data_contact)

    try:
        sql_connect.update_sql(SQL, *values)

        return 200, order_number
    except:
        return 500, None


def update_payment_status(order_number):
    order_number = int(order_number)
    SQL = "UPDATE orders SET payment_status = '已付款' WHERE order_id = %s "
    try:
        sql_connect.update_sql(SQL, order_number)

        return 200, None

    except:
        return 500, None


def get_payment_from_db(order_id):
    SQL = "SELECT order_id, order_description, contact FROM orders WHERE order_id = %s AND payment_status = '已付款' "
    result = sql_connect.search_one(SQL, order_id)
    return 200, result
