# app/models/report.py
from dataclasses import dataclass

@dataclass
class Report:
    id: int
    user_id: int
    title: str
    category: str
    description: str
    photo_url: str
    location_lat: float
    location_lng: float
    address: str
    suggestion: str
    status: str
