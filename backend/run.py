# backend/run.py
from app.app import create_app

app = create_app()

if __name__ == "__main__":
    print("🚀 Starting CivicSetu Backend...")
    print("📍 Backend URL: http://localhost:5000")
    print("📊 API Health: http://localhost:5000/api/health")
    app.run(host="0.0.0.0", port=5000, debug=True)
