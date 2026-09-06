import time
import subprocess
import requests
import uuid
import json
from jose import jwt

from auth import SECRET_KEY, ALGORITHM
from database import SessionLocal
from models import SyncAction, TriageAssessment, Patient, Facility, User

BASE_URL = "http://127.0.0.1:8006"


def get_auth_headers(user_id: int = 2) -> dict:
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    
    token_data = {
        "user_id": user.id,
        "role_id": user.role_id,
        "facility_id": user.facility_id
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"Authorization": f"Bearer {token}"}


def run_manual_demo():
    # 1. Start server
    proc = subprocess.Popen(
        ["python3", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8006"],
        cwd="/Users/chandrakanisivatejaswi/medi-path/backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        start_time = time.time()
        while time.time() - start_time < 10:
            try:
                r = requests.get(f"{BASE_URL}/health", timeout=1)
                if r.status_code == 200:
                    break
            except Exception:
                pass
            time.sleep(0.2)

        headers = get_auth_headers(2)
        db = SessionLocal()
        patient = db.query(Patient).first()
        facility = db.query(Facility).first()
        db.close()

        event_id = f"manual-demo-{uuid.uuid4()}"
        payload = {
            "patient_id": patient.id,
            "facility_id": facility.id,
            "chief_complaint": "Severe fever and chills",
            "symptoms": ["fever", "chills"],
            "temperature": 39.1,
            "urgency_level": "Urgent"
        }

        print("=== Step 1: Push initial sync event ===")
        req_body = {
            "client_event_id": event_id,
            "entity_type": "TRIAGE",
            "operation": "CREATE",
            "payload": payload
        }
        res1 = requests.post(f"{BASE_URL}/sync/push", json=req_body, headers=headers)
        print(f"Status Code: {res1.status_code}")
        print(f"Response: {json.dumps(res1.json(), indent=2)}")
        entity_id_1 = res1.json().get("entity_id")

        print("\n=== Step 2: Retry EXACT SAME sync push event (Idempotency Check) ===")
        res2 = requests.post(f"{BASE_URL}/sync/push", json=req_body, headers=headers)
        print(f"Status Code: {res2.status_code}")
        print(f"Response: {json.dumps(res2.json(), indent=2)}")
        entity_id_2 = res2.json().get("entity_id")

        print("\n=== Step 3: Verification ===")
        print(f"Initial entity_id: {entity_id_1}")
        print(f"Retried entity_id: {entity_id_2}")
        print(f"Identical entity_id returned: {entity_id_1 == entity_id_2}")

        db = SessionLocal()
        triage_count = db.query(TriageAssessment).filter(TriageAssessment.id == entity_id_1).count()
        sync_count = db.query(SyncAction).filter(SyncAction.client_event_id == event_id).count()
        db.close()
        print(f"TriageAssessment count for ID {entity_id_1}: {triage_count}")
        print(f"SyncAction count for client_event_id '{event_id}': {sync_count}")

    finally:
        proc.terminate()
        proc.wait()


if __name__ == "__main__":
    run_manual_demo()
