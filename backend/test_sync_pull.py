import time
import subprocess
import requests
import uuid
import unittest
from datetime import datetime
from jose import jwt

from auth import SECRET_KEY, ALGORITHM
from database import SessionLocal
from models import SyncAction, User, Patient, Facility

BASE_URL = "http://127.0.0.1:8007"


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


class TestSyncPullAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.proc = subprocess.Popen(
            ["python3", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8007"],
            cwd="/Users/chandrakanisivatejaswi/medi-path/backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
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

    def test_1_authentication_required(self):
        """1. Authentication required -> 401"""
        res = requests.get(f"{BASE_URL}/sync/pull")
        self.assertEqual(res.status_code, 401)

    def test_2_pull_returns_processed_actions(self):
        """2. Pull returns processed actions"""
        event_id = f"test-pull-processed-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Processed pull test",
            "urgency_level": "Routine"
        }
        push_res = requests.post(
            f"{BASE_URL}/sync/push",
            json={"client_event_id": event_id, "entity_type": "TRIAGE", "operation": "CREATE", "payload": payload},
            headers=self.headers
        )
        self.assertEqual(push_res.status_code, 200)
        pushed_action = push_res.json()

        pull_res = requests.get(f"{BASE_URL}/sync/pull?after_id=0&limit=200", headers=self.headers)
        self.assertEqual(pull_res.status_code, 200)
        data = pull_res.json()
        item_ids = [item["id"] for item in data["items"]]
        self.assertIn(pushed_action["id"], item_ids)

    def test_3_after_id_excludes_already_seen_actions(self):
        """3. after_id excludes already-seen actions"""
        pull_all = requests.get(f"{BASE_URL}/sync/pull?after_id=0&limit=200", headers=self.headers).json()
        if not pull_all["items"]:
            self.skipTest("No items in DB to test after_id")
        
        target_item = pull_all["items"][0]
        cutoff_id = target_item["id"]
        
        pull_after = requests.get(f"{BASE_URL}/sync/pull?after_id={cutoff_id}&limit=200", headers=self.headers).json()
        for item in pull_after["items"]:
            self.assertGreater(item["id"], cutoff_id)

    def test_4_pending_failed_actions_are_excluded(self):
        """4. PENDING and FAILED actions are excluded"""
        db = SessionLocal()
        now = datetime.utcnow()
        pending_action = SyncAction(
            client_event_id=f"test-pending-{uuid.uuid4()}",
            entity_type="TRIAGE",
            operation="CREATE",
            payload={"test": "pending"},
            status="PENDING",
            created_at=now
        )
        failed_action = SyncAction(
            client_event_id=f"test-failed-{uuid.uuid4()}",
            entity_type="TRIAGE",
            operation="CREATE",
            payload={"test": "failed"},
            status="FAILED",
            created_at=now
        )
        db.add(pending_action)
        db.add(failed_action)
        db.commit()
        pending_id = pending_action.id
        failed_id = failed_action.id
        db.close()

        pull_res = requests.get(f"{BASE_URL}/sync/pull?after_id=0&limit=200", headers=self.headers).json()
        pulled_ids = [item["id"] for item in pull_res["items"]]
        
        self.assertNotIn(pending_id, pulled_ids)
        self.assertNotIn(failed_id, pulled_ids)

    def test_5_empty_result_returns_correct_cursor(self):
        """5. Empty result returns correct cursor"""
        db = SessionLocal()
        max_id = db.query(SyncAction.id).order_by(SyncAction.id.desc()).first()
        db.close()
        
        huge_after_id = (max_id[0] if max_id else 0) + 10000
        pull_res = requests.get(f"{BASE_URL}/sync/pull?after_id={huge_after_id}", headers=self.headers)
        self.assertEqual(pull_res.status_code, 200)
        data = pull_res.json()
        
        self.assertEqual(data["items"], [])
        self.assertEqual(data["next_cursor"], huge_after_id)
        self.assertFalse(data["has_more"])

    def test_6_default_limit_works(self):
        """6. Default limit works (defaults to 50)"""
        pull_res = requests.get(f"{BASE_URL}/sync/pull", headers=self.headers)
        self.assertEqual(pull_res.status_code, 200)
        data = pull_res.json()
        self.assertLessEqual(len(data["items"]), 50)

    def test_7_maximum_limit_of_200_is_enforced(self):
        """7. Maximum limit of 200 is enforced"""
        res_200 = requests.get(f"{BASE_URL}/sync/pull?limit=200", headers=self.headers)
        self.assertEqual(res_200.status_code, 200)
        
        res_201 = requests.get(f"{BASE_URL}/sync/pull?limit=201", headers=self.headers)
        self.assertIn(res_201.status_code, (400, 422))

    def test_8_next_cursor_advances_correctly(self):
        """8. next_cursor advances correctly"""
        pull_res = requests.get(f"{BASE_URL}/sync/pull?after_id=0&limit=2", headers=self.headers)
        self.assertEqual(pull_res.status_code, 200)
        data = pull_res.json()
        if data["items"]:
            expected_cursor = data["items"][-1]["id"]
            self.assertEqual(data["next_cursor"], expected_cursor)

    def test_9_has_more_works_correctly_when_more_than_one_page_exists(self):
        """9. has_more works correctly when limit is smaller than total items"""
        db = SessionLocal()
        processed_count = db.query(SyncAction).filter(SyncAction.status == "PROCESSED").count()
        db.close()
        
        if processed_count >= 2:
            pull_page1 = requests.get(f"{BASE_URL}/sync/pull?after_id=0&limit=1", headers=self.headers).json()
            self.assertTrue(pull_page1["has_more"])
            self.assertEqual(len(pull_page1["items"]), 1)

    def test_10_returned_payload_matches_stored_sync_action_json(self):
        """10. Returned payload matches stored SyncAction JSON"""
        event_id = f"test-payload-match-{uuid.uuid4()}"
        payload = {
            "patient_id": self.patient_id,
            "facility_id": self.facility_id,
            "chief_complaint": "Payload test matching JSON",
            "symptoms": ["headache", "nausea"],
            "urgency_level": "Moderate"
        }
        push_res = requests.post(
            f"{BASE_URL}/sync/push",
            json={"client_event_id": event_id, "entity_type": "TRIAGE", "operation": "CREATE", "payload": payload},
            headers=self.headers
        ).json()

        pull_res = requests.get(f"{BASE_URL}/sync/pull?after_id={push_res['id'] - 1}&limit=10", headers=self.headers).json()
        matching_item = next(item for item in pull_res["items"] if item["id"] == push_res["id"])
        
        self.assertEqual(matching_item["payload"], payload)


if __name__ == "__main__":
    unittest.main()
