# app/models/user.py
# optional: dataclass representation for convenience
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    points: int = 0
