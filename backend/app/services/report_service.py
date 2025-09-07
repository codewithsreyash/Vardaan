# app/services/report_service.py
from ..utils.db import get_db
from ..config import Config
import os, base64, time
from ..utils.validators import is_valid_category

UPLOAD_FOLDER = Config.REPORT_UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def _get_category_folder(category):
    """Return folder path for category, create if not exists"""
    folder = os.path.join(UPLOAD_FOLDER, category.lower())
    os.makedirs(folder, exist_ok=True)
    return folder


def save_photo_from_dataurl(dataurl, user_id, category):
    """Save base64 encoded image to file system under category folder"""
    try:
        header, encoded = dataurl.split(",", 1)
        ext = "jpg"
        if "png" in header:
            ext = "png"
        filename = f"{int(time.time())}_{user_id}.{ext}"
        folder = _get_category_folder(category)
        path = os.path.join(folder, filename)
        with open(path, "wb") as f:
            f.write(base64.b64decode(encoded))
        return path
    except Exception:
        return None


def save_text_report(user_id, category, report_data):
    """Save report details to a .txt file under category folder"""
    folder = _get_category_folder(category)
    filename = f"{int(time.time())}_{user_id}.txt"
    path = os.path.join(folder, filename)

    content = [
        f"Title: {report_data.get('title')}",
        f"Description: {report_data.get('description')}",
        f"Address: {report_data.get('address')}",
        f"Latitude: {report_data.get('location_lat')}",
        f"Longitude: {report_data.get('location_lng')}",
        f"Suggestion: {report_data.get('suggestion')}",
        f"UserID: {user_id}",
    ]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(content))

    return path


def create_report(
    user_id,
    category,
    description,
    photo_url=None,        # ✅ new (direct file path from report.py)
    photo_dataurl=None,    # ✅ old (base64 string, optional)
    location_lat=None,
    location_lng=None,
    title=None,
    address=None,
    suggestion=None,
):
    """Insert new report into DB and save files"""
    if not is_valid_category(category):
        return None, "Invalid category"

    # handle photo (priority: file path > base64)
    if photo_url:
        final_photo = photo_url
    elif photo_dataurl:
        final_photo = save_photo_from_dataurl(photo_dataurl, user_id, category)
    else:
        final_photo = None

    # save report details into .txt
    save_text_report(
        user_id,
        category,
        {
            "title": title,
            "description": description,
            "address": address,
            "location_lat": location_lat,
            "location_lng": location_lng,
            "suggestion": suggestion,
        },
    )

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """
        INSERT INTO reports 
        (user_id, category, title, description, photo_url, location_lat, location_lng, address, suggestion, status) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            user_id,
            category,
            title,
            description,
            final_photo,
            location_lat,
            location_lng,
            address,
            suggestion,
            "pending",
        ),
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
    cursor.execute(
        "SELECT * FROM reports WHERE user_id = %s ORDER BY created_at DESC",
        (user_id,),
    )
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
    return ["garbage", "streetlight", "pothole", "waste", "other"]
