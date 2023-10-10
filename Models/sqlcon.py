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


def search_one(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchone()


def search_all(sql, *args):
    with pool.get_connection() as pooling:
        with pooling.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            return cursor.fetchall()


def update_sql(sql, *args):
    try:
        with pool.get_connection() as pooling:
            with pooling.cursor(dictionary=True) as cursor:
                cursor.execute(sql, args)
            pooling.commit()
        return 200
    except Exception as e:
        print("An error occurred:", str(e))
        pooling.rollback()
        return 500
