from . import sqlcon as sql_connect


def get_all_attractions(keyword, page, per_page):
    offset = page * per_page
    limit = per_page + 1

    if keyword == None:
        sql = "SELECT * FROM attractions LIMIT %s OFFSET %s"
        result = sql_connect.search_all(sql, limit, offset)
    else:
        sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT %s OFFSET %s"
        result = sql_connect.search_all(
            sql, "%" + keyword + "%", "%" + keyword + "%", limit, offset
        )

    return result


def get_attraction_withid(attractionId):
    sql = "SELECT * FROM attractions WHERE id = %s"
    result = sql_connect.search_one(sql, attractionId)
    return result


def get_mrts_attractions():
    sql = "SELECT mrt FROM attractions GROUP BY mrt ORDER BY COUNT(name) DESC LIMIT 40"
    results = sql_connect.search_all(sql)
    mrt_list = [result["mrt"] for result in results]
    return mrt_list
