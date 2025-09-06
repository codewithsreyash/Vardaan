import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Config:
    # JWT secret
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "superjwtsecret")

    # MySQL connection (update .env or environment variables accordingly)
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "civic_app")

    # File storage folders
    REPORT_UPLOAD_FOLDER = os.getenv("REPORT_UPLOAD_FOLDER", "user_reports")
    USER_INFO_FOLDER = os.getenv("USER_INFO_FOLDER", "user_info")
