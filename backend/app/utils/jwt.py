# app/utils/jwt.py
import jwt
from functools import wraps
from flask import request, jsonify
from ..config import Config
from .db import get_db

def generate_token(user_id):
    payload = {"id": user_id}
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        else:
            token = parts[-1]

        try:
            decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get("id")
            if not user_id:
                return jsonify({"error": "Invalid token payload"}), 401
            # fetch user from DB
            db = get_db()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT id, name, email, points FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            cursor.close()
            if not user:
                return jsonify({"error": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except Exception as e:
            return jsonify({"error": "Invalid token"}), 401

        # pass user dict into route
        return f(user, *args, **kwargs)
    return decorated
