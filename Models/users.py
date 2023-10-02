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
        sql = "SELECT id, name, email FROM users WHERE email = %s AND password = %s"
        existing_user = execute_sql_one(sql, email, password)

        if existing_user:
            return (200, existing_user)

        else:
            return (400,)

    except:
        return 500


def auth_to_db(data):
    email = data["email"]
    # id = data["id"]

    try:
        sql = "SELECT id, name, email FROM users WHERE email = %s"
        existing_user = execute_sql_one(sql, email)

        if existing_user:
            return 200, existing_user

        else:
            return None

    except:
        return 500
