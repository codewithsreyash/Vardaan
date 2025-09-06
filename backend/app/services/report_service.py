# app/services/report_service.py
from ..utils.db import get_db
from ..config import Config
import os, base64, time
from ..utils.validators import is_valid_category, normalize_status

UPLOAD_FOLDER = Config.REPORT_UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_photo_from_dataurl(dataurl, user_id):
    # dataurl like "data:image/png;base64,...."
    try:
        header, encoded = dataurl.split(",", 1)
        ext = "jpg"
        if "png" in header:
            ext = "png"
        filename = f"{int(time.time())}_{user_id}.{ext}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        with open(path, "wb") as f:
            f.write(base64.b64decode(encoded))
        return filename
    except Exception:
        return None

def create_report(user_id, category, description, photo_dataurl=None, location_lat=None, location_lng=None):
    if not is_valid_category(category):
        return None, "Invalid category"
    photo_filename = None
    if photo_dataurl:
        photo_filename = save_photo_from_dataurl(photo_dataurl, user_id)
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO reports (user_id, category, description, photo_url, location_lat, location_lng, status) VALUES (%s,%s,%s,%s,%s,%s,%s)",
        (user_id, category, description, photo_filename, location_lat, location_lng, "pending")
    )
    db.commit()
    report_id = cursor.lastrowid
    cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
    report = cursor.fetchone()
    cursor.close()
    return report, None

def get_user_reports(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reports WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    return rows

def get_all_reports():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reports ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    return rows

def get_categories():
    return ["garbage", "streetlight", "pothole", "other"]
