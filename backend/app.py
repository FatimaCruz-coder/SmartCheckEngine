import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "smart_check_engine.db")

app = Flask(__name__)
CORS(app)


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/api/codes", methods=["GET"])
def get_all_codes():
    category = request.args.get("category")  # e.g. ?category=powertrain

    conn = get_db_connection()
    cur = conn.cursor()

    if category:
        cur.execute("SELECT * FROM obd_codes WHERE category = ?", (category,))
    else:
        cur.execute("SELECT * FROM obd_codes")

    rows = cur.fetchall()
    conn.close()

    codes = []
    for row in rows:
        codes.append({
            "id": row["id"],
            "code": row["code"],
            "title": row["title"],
            "description": row["description"],
            "parts": row["parts"],
            "cost_min": row["cost_min"],
            "cost_max": row["cost_max"],
            "severity": row["severity"],
            "category": row["category"],  # NEW
        })

    return jsonify(codes)


@app.route("/api/codes/<code>", methods=["GET"])
def get_code_by_code(code):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM obd_codes WHERE code = ?", (code.upper(),))
    row = cur.fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Code not found"}), 404

    result = {
        "id": row["id"],
        "code": row["code"],
        "title": row["title"],
        "description": row["description"],
        "parts": row["parts"],
        "cost_min": row["cost_min"],
        "cost_max": row["cost_max"],
        "severity": row["severity"],
        "category": row["category"],  # NEW
    }
    return jsonify(result)


@app.route("/", methods=["GET"])
def root():
    return jsonify({"status": "ok", "message": "SmartCheckEngine API running"})


if __name__ == "__main__":
    app.run(debug=True)
