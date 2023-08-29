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


def get_mrts_attractions():
    sql = "SELECT mrt, name FROM attractions"
    result = execute_sql_all(sql)
    return result


# attractions_count = {}
# for item in get_mrts_attractions():
#     mrt = item["mrt"]

#     if mrt in attractions_count:
#         attractions_count[mrt] += 1
#     else:
#         attractions_count[mrt] = 1
# sorted_attractions = sorted(attractions_count.items(), key=lambda x: x[1], reverse=True)

# top_40 = []
# for sort in range(0, len(sorted_attractions[:40])):
#     top_40.append(sorted_attractions[sort][0])

# print(top_40)
