import Models.sqlcon as sql_connect


def create_booking_to_db(user_id, data):
    user_id = user_id
    attraction_id = data["attractionId"]
    date = data["date"]
    time = data["time"]
    price = data["price"]

    try:
        search_SQL = "SELECT user_id FROM bookings WHERE user_id = %s"
        existing_user = sql_connect.search_one(search_SQL, user_id)
        if existing_user:
            SQL = "UPDATE bookings SET attraction_id = %s, date = %s, time = %s, price = %s WHERE user_id = %s"
            values = (attraction_id, date, time, price, user_id)
            sql_connect.update_sql(SQL, *values)

        else:
            SQL = "INSERT INTO bookings(user_id, attraction_id, date, time, price) VALUES(%s, %s, %s, %s, %s)"
            values = (user_id, attraction_id, date, time, price)
            sql_connect.update_sql(SQL, *values)

        return 200, None
    except:
        return 500, None


def search_booking_to_db(user_id):
    SQL = "SELECT bookings.*, attractions.name, attractions.address, attractions.images FROM bookings INNER JOIN attractions ON bookings.attraction_id = attractions.id WHERE bookings.user_id = %s"
    result = sql_connect.search_all(SQL, user_id)

    return 200, result


def delete_booking_to_db(user_id, attraction_id):
    try:
        SQL = "DELETE FROM bookings WHERE user_id = %s AND attraction_id = %s"

        sql_connect.update_sql(SQL, user_id, attraction_id)
        return 200, None

    except Exception as e:
        print("delete_booking_to_db:", str(e))
        return 500, None
