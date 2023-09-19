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


def get_all_attractions(keyword, page, per_page):
    offset = page * per_page
    limit = per_page + 1

    if keyword == None:
        sql = "SELECT * FROM attractions LIMIT %s OFFSET %s"
        result = execute_sql_all(sql, limit, offset)
    else:
        sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT %s OFFSET %s"
        result = execute_sql_all(
            sql, "%" + keyword + "%", "%" + keyword + "%", limit, offset
        )

    return result


def get_attraction_withid(attractionId):
    sql = "SELECT * FROM attractions WHERE id = %s"
    result = execute_sql_one(sql, attractionId)
    return result


def get_mrts_attractions():
    sql = "SELECT mrt FROM attractions GROUP BY mrt ORDER BY COUNT(name) DESC LIMIT 40"
    results = execute_sql_all(sql)
    mrt_list = [result["mrt"] for result in results]
    return mrt_list


def signup_to_db(data):
    name = data["name"]
    email = data["email"]
    password = data["password"]

    try:
        sql = "SELECT email FROM users WHERE email = %s"
        existing_user = execute_sql_one(sql, email)

        if existing_user:
            return 400

        else:
            with pool.get_connection() as pooling:
                with pooling.cursor() as cursor:
                    add_user = (
                        "INSERT INTO users(name, email, password) VALUES(%s, %s, %s)"
                    )
                    values = (name, email, password)
                    cursor.execute(add_user, values)
                pooling.commit()

            return 200

    except:
        return 500


def signin_to_db(data):
    email = data["email"]
    password = data["password"]

    try:
        sql = "SELECT email, password FROM users WHERE email = %s AND password = %s"
        existing_user = execute_sql_one(sql, email, password)

        if existing_user:
            return 200

        else:
            return 400

    except:
        return 500
