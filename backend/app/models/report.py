# app/models/report.py
from dataclasses import dataclass

@dataclass
class Report:
    id: int
    user_id: int
    category: str
    description: str
    photo_url: str
    location_lat: float
    location_lng: float
    status: str
