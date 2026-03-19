import sqlite3
import os
import csv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "smart_check_engine.db")
CSV_PATH = os.path.join(BASE_DIR, "obd_codes.csv")


def category_for(code: str) -> str:
    """
    Map OBD-II code letter to category:
    P = powertrain, B = body, C = chassis, U = network.
    """
    if not code:
        return "other"
    first = code.strip().upper()[0]
    if first == "P":
        return "powertrain"
    if first == "B":
        return "body"
    if first == "C":
        return "chassis"
    if first == "U":
        return "network"
    return "other"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Create table (includes category)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS obd_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            parts TEXT,
            cost_min INTEGER,
            cost_max INTEGER,
            severity TEXT,
            category TEXT
        );
        """
    )

    # Load codes from CSV
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row["code"].strip()
            title = row["title"].strip()
            description = row["description"].strip()
            parts = row.get("parts", "").strip() or None
            cost_min_str = row.get("cost_min", "").strip()
            cost_max_str = row.get("cost_max", "").strip()
            severity = row.get("severity", "").strip() or None

            cost_min = int(cost_min_str) if cost_min_str else None
            cost_max = int(cost_max_str) if cost_max_str else None

            cur.execute(
                """
                INSERT OR IGNORE INTO obd_codes
                (code, title, description, parts, cost_min, cost_max, severity, category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    code,
                    title,
                    description,
                    parts,
                    cost_min,
                    cost_max,
                    severity,
                    category_for(code),
                ),
            )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized from CSV.")
