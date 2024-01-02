import mysql.connector
import configparser
import os

current_directory = os.path.dirname(__file__)
ini_file_path = os.path.join(current_directory, "../setting.ini")


config = configparser.ConfigParser()
config.read(ini_file_path)

db_config = config["database"]

# connect to sql by pool
pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name=db_config["pool_name"],
    pool_size=5,
    host=db_config["host"],
    user=db_config["user"],
    password=db_config["password"],
    database=db_config["database"],
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
