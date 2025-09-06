# app/app.py
from flask import Flask
from flask_cors import CORS
from .config import Config
from .utils.db import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS for local dev frontends (allow all origins during dev)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # init DB connection helpers
    init_db(app)

    # register blueprints
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
