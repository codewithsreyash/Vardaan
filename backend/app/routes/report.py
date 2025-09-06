# app/routes/report.py
from flask import Blueprint, request, jsonify
from ..utils.jwt import token_required
from ..services.report_service import create_report, get_user_reports, get_all_reports, get_categories

report_bp = Blueprint("report_bp", __name__)

# create report (POST /api/reports)
@report_bp.route("", methods=["POST"])
@token_required
def route_create_report(current_user):
    data = request.get_json() or {}
    category = data.get("category")
    description = data.get("description", "")
    photo_url = data.get("photo_url")  # expect data URL from client
    location_lat = data.get("location_lat")
    location_lng = data.get("location_lng")

    rpt, err = create_report(current_user["id"], category, description, photo_url, location_lat, location_lng)
    if err:
        return jsonify({"error": err}), 400
    return jsonify(rpt), 201

# get current user's reports (GET /api/reports/my)
@report_bp.route("/my", methods=["GET"])
@token_required
def route_get_my_reports(current_user):
    rows = get_user_reports(current_user["id"])
    return jsonify(rows), 200

# get public feed (GET /api/reports)
@report_bp.route("", methods=["GET"])
def route_get_all_reports():
    rows = get_all_reports()
    return jsonify(rows), 200

# categories (GET /api/reports/categories)
@report_bp.route("/categories", methods=["GET"])
def route_get_categories():
    return jsonify(get_categories()), 200
