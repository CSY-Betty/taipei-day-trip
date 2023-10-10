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
        search_SQL = "SELECT user_id FROM bookings WHERE user_id = %s"
        existing_user = execute_sql_one(search_SQL, user_id)
        if existing_user:
            with pool.get_connection() as pooling:
                with pooling.cursor() as cursor:
                    SQL = "UPDATE bookings SET attraction_id = %s, date = %s, time = %s, price = %s WHERE user_id = %s"
                    values = (attraction_id, date, time, price, user_id)
                    cursor.execute(SQL, values)
                pooling.commit()
        else:
            with pool.get_connection() as pooling:
                with pooling.cursor() as cursor:
                    SQL = "INSERT INTO bookings(user_id, attraction_id, date, time, price) VALUES(%s, %s, %s, %s, %s)"
                    values = (user_id, attraction_id, date, time, price)
                    cursor.execute(SQL, values)
                pooling.commit()

        return 200
    except:
        return 500


def search_booking_to_db(user_id):
    SQL = "SELECT bookings.*, attractions.name, attractions.address, attractions.images FROM bookings INNER JOIN attractions ON bookings.attraction_id = attractions.id WHERE bookings.user_id = %s"
    result = execute_sql_all(SQL, user_id)

    return 200, result


def delete_booking_to_db(user_id, attraction_id):
    try:
        with pool.get_connection() as pooling:
            with pooling.cursor() as cursor:
                SQL = "DELETE FROM bookings WHERE user_id = %s AND attraction_id = %s"
                values = (user_id, attraction_id)
                cursor.execute(SQL, values)
            pooling.commit()
        return 200

    except:
        return 500
