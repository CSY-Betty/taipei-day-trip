import mysql.connector

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


def execute_sql_all(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchall()


def create_booking_to_db(data, user):
    user_id = user["id"]
    attraction_id = data["attractionId"]
    date = data["date"]
    time = data["time"]
    price = data["price"]

    try:
        with pool.get_connection() as pooling:
            with pooling.cursor() as cursor:
                SQL = "INSERT INTO bookings(user_id, attraction_id, date, time, price) VALUES(%s, %s, %s, %s, %s)"
                values = (user_id, attraction_id, date, time, price)
                cursor.execute(SQL, values)
            pooling.commit()
        return 200
    except:
        return 500
