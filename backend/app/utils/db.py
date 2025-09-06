# app/utils/db.py
import mysql.connector
from flask import g
from ..config import Config

def get_db():
    if "db" not in g:
        g.db = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            autocommit=False
        )
    return g.db

def init_db(app):
    @app.teardown_appcontext
    def close_db(exc):
        db = g.pop("db", None)
        if db is not None:
            try:
                db.close()
            except Exception:
                pass
