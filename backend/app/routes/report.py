# backend/app/routes/report.py
import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from ..utils.jwt import token_required
from ..utils.db import get_db
from ..config import Config

report_bp = Blueprint("report_bp", __name__)

# Allowed extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Create new report
@report_bp.route("", methods=["POST"])
@token_required
def add_report(current_user):
    try:
        # Handle file upload
        photo_path = None
        if "image" in request.files:
            file = request.files["image"]
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                category = request.form.get("category", "other").lower()
                folder = os.path.join("uploads", category)
                os.makedirs(folder, exist_ok=True)
                photo_path = os.path.join(folder, filename)
                file.save(photo_path)

        # Collect form fields
        title = request.form.get("title")
        description = request.form.get("description")
        category = request.form.get("category", "other").lower()
        suggestion = request.form.get("suggestion")
        latitude = request.form.get("latitude")
        longitude = request.form.get("longitude")
        address = request.form.get("address")

        # Validate required fields
        if not description:
            return jsonify({"error": "Description is required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            INSERT INTO reports 
            (user_id, category, title, description, photo_url, location_lat, location_lng, address, suggestion, status) 
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            current_user["id"],
            category,
            title,
            description,
            photo_path,
            latitude,
            longitude,
            address,
            suggestion,
            "pending",
        ))
        
        report_id = cursor.lastrowid
        cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
        report = cursor.fetchone()
        cursor.close()
        
        return jsonify(report), 201
        
    except Exception as e:
        print("Report creation error:", e)
        return jsonify({"error": str(e)}), 500

# Get current user reports
@report_bp.route("/my", methods=["GET"])
@token_required
def my_reports(current_user):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM reports 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (current_user["id"],))
        reports = cursor.fetchall()
        cursor.close()
        return jsonify(reports), 200
    except Exception as e:
        print("My reports error:", e)
        return jsonify({"error": str(e)}), 500

# Get all reports
@report_bp.route("", methods=["GET"])
@token_required
def all_reports(current_user):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM reports ORDER BY created_at DESC")
        reports = cursor.fetchall()
        cursor.close()
        return jsonify(reports), 200
    except Exception as e:
        print("All reports error:", e)
        return jsonify({"error": str(e)}), 500

# Get single report
@report_bp.route("/<int:report_id>", methods=["GET"])
@token_required
def get_report(current_user, report_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
        report = cursor.fetchone()
        cursor.close()
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        return jsonify(report), 200
    except Exception as e:
        print("Get report error:", e)
        return jsonify({"error": str(e)}), 500

# Get available categories
@report_bp.route("/categories", methods=["GET"])
def categories():
    return jsonify(["garbage", "streetlight", "pothole", "waste", "other"]), 200
