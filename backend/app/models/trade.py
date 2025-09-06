# app/models/trade.py
from dataclasses import dataclass

@dataclass
class Trade:
    id: int
    user_id: int
    weight_kg: float
    reward_points: int
