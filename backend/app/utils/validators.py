# app/utils/validators.py
def is_valid_category(cat):
    return cat in ("garbage", "streetlight", "pothole", "other")

def normalize_status(status):
    allowed = ("pending", "in_progress", "resolved")
    return status if status in allowed else "pending"
