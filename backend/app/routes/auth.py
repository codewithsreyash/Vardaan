# app/routes/auth.py
from flask import Blueprint, request, jsonify
from ..utils.db import get_db
from ..config import Config
import bcrypt, jwt
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

# ✅ Helper to create JWT
def generate_token(user_id):
    return jwt.encode(
        {"id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)},
        Config.JWT_SECRET_KEY,
        algorithm="HS256",
    )

# ✅ REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        print("Request data:", data)  # debug log

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # validate inputs
        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        # check existing user
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 409  # conflict

        # hash password
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # insert
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed),
        )
        db.commit()
        user_id = cursor.lastrowid

        # fetch back
        cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        token = generate_token(user["id"])
        return jsonify({"user": user, "token": token}), 201

    except Exception as e:
        print("Register error:", e)
        return jsonify({"error": "Server error while registering"}), 500


# ✅ LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"error": "Invalid password"}), 401

        token = generate_token(user["id"])
        return jsonify(
            {
                "user": {"id": user["id"], "name": user["name"], "email": user["email"]},
                "token": token,
            }
        ), 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Server error while logging in"}), 500
