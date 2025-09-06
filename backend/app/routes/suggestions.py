# app/routes/suggestions.py
from flask import Blueprint, request, jsonify
from ..utils.jwt import token_required
from ..utils.db import get_db

suggestions_bp = Blueprint("suggestions_bp", __name__)

@suggestions_bp.route("", methods=["POST"])
@token_required
def add_suggestion(current_user):
    data = request.get_json() or {}
    suggestion = data.get("suggestion")
    if not suggestion:
        return jsonify({"error":"Suggestion required"}), 400
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO suggestions (user_id, suggestion) VALUES (%s,%s)", (current_user["id"], suggestion))
    db.commit()
    cursor.close()
    return jsonify({"message":"Suggestion submitted"}), 201

@suggestions_bp.route("", methods=["GET"])
def list_suggestions():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT s.id, s.suggestion, s.created_at, u.name FROM suggestions s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    return jsonify(rows), 200
