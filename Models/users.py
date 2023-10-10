import Models.sqlcon as sql_connect


def signup_to_db(data):
    name = data["name"]
    email = data["email"]
    password = data["password"]

    try:
        sql = "SELECT email FROM users WHERE email = %s"
        existing_user = sql_connect.search_one(sql, email)

        if existing_user:
            return 400, None

        else:
            add_user = "INSERT INTO users(name, email, password) VALUES(%s, %s, %s)"
            values = (name, email, password)
            result = sql_connect.update_sql(add_user, *values)
            return 200, result
    except:
        return 500, None


def signin_to_db(data):
    email = data["email"]
    password = data["password"]

    try:
        sql = "SELECT id, name, email FROM users WHERE email = %s AND password = %s"
        existing_user = sql_connect.search_one(sql, email, password)

        if existing_user:
            return 200, existing_user

        else:
            return 400, None

    except:
        return 500, None


def auth_to_db(data):
    email = data["email"]

    try:
        sql = "SELECT id, name, email FROM users WHERE email = %s"
        existing_user = sql_connect.search_one(sql, email)

        if existing_user:
            return 200, existing_user

        else:
            return 400, None

    except:
        return 500, None
