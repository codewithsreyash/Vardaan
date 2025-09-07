# backend/app/routes/leaderboard.py
from flask import Blueprint, jsonify, request
from ..utils.db import get_db
from ..utils.jwt import token_required

leaderboard_bp = Blueprint("leaderboard_bp", __name__)

@leaderboard_bp.route("", methods=["GET"])
@token_required
def leaderboard(current_user):
    try:
        filter_type = request.args.get('filter', 'weekly')
        
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Base query - get users with points and report counts
        query = """
        SELECT u.id, u.name, u.email, u.points, COUNT(r.id) as reports_count,
               (u.points + COUNT(r.id) * 5) as total_score
        FROM users u
        LEFT JOIN reports r ON u.id = r.user_id
        """
        
        # Add time filter if needed
        if filter_type == 'daily':
            query += " AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)"
        elif filter_type == 'weekly':
            query += " AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)"
        
        query += """
        GROUP BY u.id
        ORDER BY total_score DESC
        LIMIT 100
        """
        
        cursor.execute(query)
        users = cursor.fetchall()
        
        # Find current user's rank
        current_user_rank = None
        for idx, user in enumerate(users, 1):
            if user['id'] == current_user['id']:
                current_user_rank = {
                    'rank': idx,
                    'points': user['total_score'],
                    'name': user['name']
                }
                break
        
        cursor.close()
        
        return jsonify({
            'users': users,
            'currentUser': current_user_rank
        }), 200
        
    except Exception as e:
        print("Leaderboard error:", e)
        return jsonify({"error": "Failed to fetch leaderboard"}), 500
