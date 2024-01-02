import json
import re
import mysql.connector
import sys
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


pathname = sys.path[0]
json_path = pathname + "/taipei-attractions.json"

with open(json_path, "r") as f:
    data = json.load(f)


def get_image(file):
    images = []
    file_lower = file.lower()
    urls = re.findall(r"https:\/\/.*?\.(?:jpg|png)", file_lower)
    for url in urls:
        images.append(url)
    return images


for i in range(data["result"]["count"]):
    id = data["result"]["results"][i]["_id"]
    name = data["result"]["results"][i]["name"]
    category = data["result"]["results"][i]["CAT"]
    description = data["result"]["results"][i]["description"]
    address = data["result"]["results"][i]["address"]
    transport = data["result"]["results"][i]["direction"]
    mrt = data["result"]["results"][i]["MRT"]
    latitude = data["result"]["results"][i]["latitude"]
    longitude = data["result"]["results"][i]["longitude"]
    images = get_image(data["result"]["results"][i]["file"])
    images_json = json.dumps(images)

    with pool.get_connection() as pooling:
        with pooling.cursor() as cursor:
            sql_attraction = "INSERT INTO attractions(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            values = (
                id,
                name,
                category,
                description,
                address,
                transport,
                mrt,
                latitude,
                longitude,
                images_json,
            )
            cursor.execute(sql_attraction, values)
        pooling.commit()
