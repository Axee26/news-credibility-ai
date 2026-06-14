import pymysql


def get_connection():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="여기에 MySQL 비밀번호",
        database="news_credibility",
        charset="utf8mb4"
    )

    return conn