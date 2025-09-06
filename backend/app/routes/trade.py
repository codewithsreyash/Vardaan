# app/routes/trade.py
from flask import Blueprint, request, jsonify
from ..utils.jwt import token_required
from ..services.trade_service import create_trade, get_user_trades

trade_bp = Blueprint("trade_bp", __name__)

@trade_bp.route("", methods=["POST"])
@token_required
def add_trade(current_user):
    data = request.get_json() or {}
    weight = data.get("weight_kg")
    trade, err = create_trade(current_user["id"], weight)
    if err:
        return jsonify({"error": err}), 400
    return jsonify(trade), 201

@trade_bp.route("/my", methods=["GET"])
@token_required
def my_trades(current_user):
    rows = get_user_trades(current_user["id"])
    return jsonify(rows), 200
