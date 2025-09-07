# app/routes/report.py
import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from ..utils.jwt import token_required
from ..services.report_service import create_report, get_user_reports, get_all_reports, get_categories

report_bp = Blueprint("report_bp", __name__)

# Allowed extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# -----------------------------
# Create new report
# -----------------------------
@report_bp.route("", methods=["POST"])
@token_required
def add_report(current_user):
    try:
        if "image" not in request.files:
            return jsonify({"error": "Image is required"}), 400

        file = request.files["image"]
        photo_path = None

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

        # Save report (DB + text file handled inside service)
        rpt, err = create_report(
            user_id=current_user["id"],
            category=category,
            title=title,
            description=description,
            photo_url=photo_path,
            location_lat=latitude,
            location_lng=longitude,
            address=address,
            suggestion=suggestion,
        )

        if err:
            return jsonify({"error": err}), 400

        return jsonify(rpt), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get current user reports
# -----------------------------
@report_bp.route("/my", methods=["GET"])
@token_required
def my_reports(current_user):
    try:
        reports = get_user_reports(current_user["id"])
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get all reports
# -----------------------------
@report_bp.route("/all", methods=["GET"])
@token_required
def all_reports(current_user):
    try:
        reports = get_all_reports()
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get available categories
# -----------------------------
@report_bp.route("/categories", methods=["GET"])
def categories():
    return jsonify(get_categories()), 200
