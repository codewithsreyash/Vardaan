# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from ..config import Config
from .db import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow CORS for frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # Initialize database
    init_db(app)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.report import report_bp
    from .routes.trade import trade_bp
    from .routes.suggestions import suggestions_bp
    from .routes.leaderboard import leaderboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(report_bp, url_prefix="/api/reports")
    app.register_blueprint(trade_bp, url_prefix="/api/trade")
    app.register_blueprint(suggestions_bp, url_prefix="/api/suggestions")
    app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Civic App API running"}

    return app