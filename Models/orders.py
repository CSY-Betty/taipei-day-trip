import mysql.connector
import json

# connect to sql by pool
pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    host="localhost",
    user="root",
    password="root123",
    database="tdtWeb",
)


def execute_sql_one(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchone()


def create_order(order_number, user_id, data):
    data_order = json.dumps(data["order"])
    data_contact = json.dumps(data["contact"])
    sql = "INSERT INTO orders(order_id, user_id, order_description, contact) VALUES(%s, %s, %s, %s)"
    values = (order_number, user_id, data_order, data_contact)

    try:
        with pool.get_connection() as pooling:
            with pooling.cursor(dictionary=True) as cursor:
                cursor.execute(sql, values)
            pooling.commit()
        return 200, order_number
    except:
        return 500, None


def update_payment_status(order_number):
    order_number = int(order_number)
    SQL = "UPDATE orders SET payment_status = '已付款' WHERE order_id = %s "
    try:
        with pool.get_connection() as pooling:
            with pooling.cursor() as cursor:
                cursor.execute(SQL, (order_number,))
            pooling.commit()
        return 200

    except:
        return 500


def get_payment_to_db(order_id):
    SQL = "SELECT order_id, order_description, contact FROM orders WHERE order_id = %s AND payment_status = '已付款' "

    result = execute_sql_one(SQL, order_id)

    return result
