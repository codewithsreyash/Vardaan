# app/services/trade_service.py
from ..utils.db import get_db

def create_trade(user_id, weight_kg):
    try:
        weight = float(weight_kg)
    except Exception:
        return None, "Invalid weight"

    reward_points = int(weight * 10)  # simple conversion
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("INSERT INTO trades (user_id, weight_kg, reward_points) VALUES (%s,%s,%s)", (user_id, weight, reward_points))
    db.commit()
    trade_id = cursor.lastrowid
    cursor.execute("SELECT * FROM trades WHERE id = %s", (trade_id,))
    trade = cursor.fetchone()
    # update user points
    cursor.execute("UPDATE users SET points = points + %s WHERE id = %s", (reward_points, user_id))
    db.commit()
    cursor.close()
    return trade, None

def get_user_trades(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM trades WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    return rows
