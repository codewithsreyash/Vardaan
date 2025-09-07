from flask import Flask
from flask_cors import CORS
from .routes.report import report_bp
from .routes.auth import auth_bp   # ✅ import your auth blueprint

def create_app():
    app = Flask(__name__)
    app.config["UPLOAD_FOLDER"] = "uploads"

    # ✅ Allow CORS for frontend (dev: allow all)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ✅ Register blueprints
    app.register_blueprint(report_bp, url_prefix="/api/reports")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")   # 👈 add this

    return app
