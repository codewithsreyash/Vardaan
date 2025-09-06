# app/routes/leaderboard.py
from flask import Blueprint, jsonify
from ..utils.db import get_db

leaderboard_bp = Blueprint("leaderboard_bp", __name__)

@leaderboard_bp.route("", methods=["GET"])
def leaderboard():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.points, COUNT(r.id) AS reports_count
        FROM users u
        LEFT JOIN reports r ON u.id = r.user_id
        GROUP BY u.id
        ORDER BY (u.points + COUNT(r.id)) DESC
        LIMIT 100
    """)
    rows = cursor.fetchall()
    cursor.close()
    return jsonify(rows), 200
