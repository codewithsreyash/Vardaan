# backend/app/routes/suggestions.py
from flask import Blueprint, request, jsonify
from ..utils.db import get_db
from ..utils.jwt import token_required

suggestions_bp = Blueprint("suggestions_bp", __name__)

@suggestions_bp.route("", methods=["POST"])
@token_required
def add_suggestion(current_user):
    data = request.get_json()
    suggestion = data.get("suggestion", "").strip()
    category = data.get("category", "").strip()
    contact = data.get("contact", "").strip()

    if not suggestion:
        return jsonify({"error": "Suggestion text required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO suggestions (user_id, suggestion, category, contact) VALUES (%s,%s,%s,%s)",
        (current_user["id"], suggestion, category, contact),
    )
    db.commit()
    cursor.close()
    return jsonify({"message": "Suggestion submitted"}), 201