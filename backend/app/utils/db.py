# backend/app/utils/db.py
import mysql.connector
from mysql.connector import Error
from flask import g, current_app
from ..config import Config

def get_db():
    """Get database connection, create if doesn't exist"""
    if 'db' not in g:
        try:
            g.db = mysql.connector.connect(
                host=Config.MYSQL_HOST,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                database=Config.MYSQL_DATABASE,
                autocommit=True
            )
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            raise e
    return g.db

def close_db(error):
    """Close database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db(app):
    """Initialize database with app context"""
    app.teardown_appcontext(close_db)
    
    # Create tables if they don't exist
    with app.app_context():
        create_tables()

def create_tables():
    """Create all necessary tables"""
    db = get_db()
    cursor = db.cursor()
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            points INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            category VARCHAR(50) NOT NULL,
            title VARCHAR(255),
            description TEXT,
            photo_url VARCHAR(500),
            location_lat DECIMAL(10, 8),
            location_lng DECIMAL(11, 8),
            address TEXT,
            suggestion TEXT,
            status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Trades table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trades (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            weight_kg DECIMAL(5, 2) NOT NULL,
            reward_points INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Suggestions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS suggestions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            suggestion TEXT NOT NULL,
            category VARCHAR(100),
            contact VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    cursor.close()
    print("✅ Database tables created successfully")
