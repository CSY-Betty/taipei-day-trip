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


def execite_sql_many(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchmany()


def execute_sql_all(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchall()


def get_attraction_all(page, per_page):
    offset = page * per_page
    sql = "SELECT * FROM attractions LIMIT %s OFFSET %s"
    result = execute_sql_all(sql, per_page, offset)
    return result


def get_attraction_with_keyword(keyword, page, per_page):
    offset = page * per_page
    sql = "SELECT * FROM attractions WHERE name LIKE %s LIMIT %s OFFSET %s"
    result = execute_sql_all(sql, "%" + keyword + "%", per_page, offset)
    return result


def get_attraction_withid(attractionId):
    sql = "SELECT * FROM attractions WHERE id = %s"
    result = execute_sql_one(sql, attractionId)
    return result


def get_mrts_attractions():
    sql = "SELECT mrt, name FROM attractions"
    result = execute_sql_all(sql)
    return result
