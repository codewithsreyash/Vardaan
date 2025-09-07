import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    try:
        print("🔄 Testing MySQL connection...")
        
        # Connection parameters from .env
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE', 'civic_app'),
            auth_plugin='mysql_native_password'  # For compatibility
        )
        
        if connection.is_connected():
            print("✅ Successfully connected to MySQL!")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            database_name = cursor.fetchone()
            print(f"✅ Connected to database: {database_name[0]}")
            
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print(f"✅ Tables found: {len(tables)}")
            
            cursor.close()
            connection.close()
            print("✅ Connection test successful!")
            
    except mysql.connector.Error as e:
        print(f"❌ MySQL Error: {e}")
        print("💡 Check your .env file password")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_connection()