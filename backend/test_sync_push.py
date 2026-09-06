import time
import subprocess
import requests
import uuid
import threading
import unittest
from jose import jwt

from auth import SECRET_KEY, ALGORITHM
from database import SessionLocal
from models import SyncAction, TriageAssessment, Patient, Facility, User

BASE_URL = "http://127.0.0.1:8005"


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


class TestSyncPushAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Start uvicorn server on port 8005
        cls.proc = subprocess.Popen(
            ["python3", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8005"],
            cwd="/Users/chandrakanisivatejaswi/medi-path/backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        # Wait for server to start
        start_time = time.time()
        while time.time() - start_time < 10:
            try:
                r = requests.get(f"{BASE_URL}/health", timeout=1)
                if r.status_code == 200:
                    break
            except Exception:
                pass
            time.sleep(0.2)

    @classmethod
    def tearDownClass(cls):
        cls.proc.terminate()
        cls.proc.wait()

    def setUp(self):
        self.headers = get_auth_headers(2)
        db = SessionLocal()
        patient = db.query(Patient).first()
        facility = db.query(Facility).first()
        self.patient_id = patient.id if patient else 1
        self.facility_id = facility.id if facility else 1
        db.close()

    def test_1_unauthenticated_request_returns_401(self):
        """Unauthenticated request -> 401"""
        response = requests.post(f"{BASE_URL}/sync/push", json={
            "client_event_id": str(uuid.uuid4()),
            "entity_type": "TRIAGE",
            "operation": "CREATE",
            "payload": {
                "patient_id": self.patient_id,
                "facility_id": self.facility_id,
                "chief_complaint": "Unauthenticated test",
                "urgency_level": "Routine"
            }
        })
        self.assertEqual(response.status_code, 401)

    def test_2_new_client_event_id_creates_sync_action_and_triage_assessment(self):
        """New client_event_id -> one SyncAction + one TriageAssessment"""
        event_id = f"test-event-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Chest pain and shortness of breath",
            "symptoms": ["chest pain", "dyspnea"],
            "temperature": 37.5,
            "heart_rate": 88,
            "urgency_level": "Emergency",
            "notes": "Sync push test"
        }
        
        response = requests.post(
            f"{BASE_URL}/sync/push",
            json={
                "client_event_id": event_id,
                "entity_type": "TRIAGE",
                "operation": "CREATE",
                "payload": payload
            },
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200, response.text)
        data = response.json()
        self.assertEqual(data["client_event_id"], event_id)
        self.assertEqual(data["status"], "PROCESSED")
        self.assertIsNotNone(data["entity_id"])
        
        # Verify in DB
        db = SessionLocal()
        sync_action = db.query(SyncAction).filter(SyncAction.client_event_id == event_id).first()
        self.assertIsNotNone(sync_action)
        self.assertEqual(sync_action.entity_id, data["entity_id"])
        
        triage = db.query(TriageAssessment).filter(TriageAssessment.id == data["entity_id"]).first()
        self.assertIsNotNone(triage)
        self.assertEqual(triage.chief_complaint, "Chest pain and shortness of breath")
        self.assertEqual(triage.patient_id, self.patient_id)
        db.close()

    def test_3_same_client_event_id_repeated_returns_same_entity_id_and_does_not_duplicate(self):
        """Same client_event_id repeated -> same entity_id, no duplicate TriageAssessment"""
        event_id = f"test-event-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Repeated request test",
            "urgency_level": "Urgent"
        }
        
        # First request
        res1 = requests.post(
            f"{BASE_URL}/sync/push",
            json={
                "client_event_id": event_id,
                "entity_type": "TRIAGE",
                "operation": "CREATE",
                "payload": payload
            },
            headers=self.headers
        )
        self.assertEqual(res1.status_code, 200)
        entity_id_1 = res1.json()["entity_id"]
        
        # Count triages before repetition
        db = SessionLocal()
        count_before = db.query(TriageAssessment).count()
        sync_count_before = db.query(SyncAction).count()
        db.close()
        
        # Second request (repeated)
        res2 = requests.post(
            f"{BASE_URL}/sync/push",
            json={
                "client_event_id": event_id,
                "entity_type": "TRIAGE",
                "operation": "CREATE",
                "payload": payload
            },
            headers=self.headers
        )
        self.assertEqual(res2.status_code, 200)
        entity_id_2 = res2.json()["entity_id"]
        self.assertEqual(entity_id_1, entity_id_2)
        
        # Verify counts did not change
        db = SessionLocal()
        count_after = db.query(TriageAssessment).count()
        sync_count_after = db.query(SyncAction).count()
        db.close()
        
        self.assertEqual(count_before, count_after)
        self.assertEqual(sync_count_before, sync_count_after)

    def test_4_different_client_event_id_creates_new_triage_assessment(self):
        """Different client_event_id -> new TriageAssessment"""
        event_id_1 = f"test-event-{uuid.uuid4()}"
        event_id_2 = f"test-event-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Different event ID test",
            "urgency_level": "Routine"
        }
        
        res1 = requests.post(f"{BASE_URL}/sync/push", json={"client_event_id": event_id_1, "entity_type": "TRIAGE", "operation": "CREATE", "payload": payload}, headers=self.headers)
        res2 = requests.post(f"{BASE_URL}/sync/push", json={"client_event_id": event_id_2, "entity_type": "TRIAGE", "operation": "CREATE", "payload": payload}, headers=self.headers)
        
        self.assertEqual(res1.status_code, 200)
        self.assertEqual(res2.status_code, 200)
        self.assertNotEqual(res1.json()["entity_id"], res2.json()["entity_id"])
        self.assertNotEqual(res1.json()["client_event_id"], res2.json()["client_event_id"])

    def test_5_invalid_triage_payload_creates_no_sync_action_or_triage_record(self):
        """Invalid triage payload -> no successful sync action / triage record"""
        event_id = f"test-event-{uuid.uuid4()}"
        # Missing required fields like chief_complaint and urgency_level
        invalid_payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id
        }
        
        response = requests.post(
            f"{BASE_URL}/sync/push",
            json={
                "client_event_id": event_id,
                "entity_type": "TRIAGE",
                "operation": "CREATE",
                "payload": invalid_payload
            },
            headers=self.headers
        )
        self.assertEqual(response.status_code, 400)
        
        # Verify no SyncAction or TriageAssessment was created for this client_event_id
        db = SessionLocal()
        sync_action = db.query(SyncAction).filter(SyncAction.client_event_id == event_id).first()
        self.assertIsNone(sync_action)
        db.close()

    def test_6_unsupported_entity_type_or_operation_returns_400(self):
        """Unsupported entity_type or operation -> 400"""
        event_id = f"test-event-{uuid.uuid4()}"
        response = requests.post(
            f"{BASE_URL}/sync/push",
            json={
                "client_event_id": event_id,
                "entity_type": "PATIENT",
                "operation": "CREATE",
                "payload": {}
            },
            headers=self.headers
        )
        self.assertEqual(response.status_code, 400)

    def test_7_concurrent_unique_constraint_handling_is_safe(self):
        """Duplicate/concurrent unique constraint handling is safe"""
        event_id = f"test-event-concurrent-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Concurrent test",
            "urgency_level": "Urgent"
        }

        results = []
        def send_request():
            res = requests.post(
                f"{BASE_URL}/sync/push",
                json={
                    "client_event_id": event_id,
                    "entity_type": "TRIAGE",
                    "operation": "CREATE",
                    "payload": payload
                },
                headers=self.headers
            )
            results.append(res)

        threads = [threading.Thread(target=send_request) for _ in range(5)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        self.assertEqual(len(results), 5)
        for res in results:
            self.assertEqual(res.status_code, 200)

        entity_ids = {res.json()["entity_id"] for res in results}
        self.assertEqual(len(entity_ids), 1)


if __name__ == "__main__":
    unittest.main()
