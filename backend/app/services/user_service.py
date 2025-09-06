# app/services/user_service.py
from ..utils.db import get_db
import bcrypt

def create_user(name, email, password):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return None, "User already exists"

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed))
    db.commit()
    user_id = cursor.lastrowid
    cursor.execute("SELECT id, name, email, points FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    return user, None

def authenticate_user(email, password):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    if not user:
        return None, "User not found"
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return None, "Invalid credentials"
    # return minimal user
    return {"id": user["id"], "name": user["name"], "email": user["email"], "points": user.get("points",0)}, None
