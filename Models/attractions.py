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
