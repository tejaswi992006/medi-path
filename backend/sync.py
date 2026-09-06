from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from models import SyncAction, TriageAssessment, Patient, Facility, User
from schemas import SyncPushRequest, SyncActionResponse, TriageAssessmentCreate
from auth import get_current_user

router = APIRouter(
    prefix="/sync",
    tags=["Sync"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/push", response_model=SyncActionResponse)
def sync_push(
    sync_data: SyncPushRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Idempotency check: return existing SyncAction if client_event_id was already processed
    existing_sync = db.query(SyncAction).filter(
        SyncAction.client_event_id == sync_data.client_event_id
    ).first()
    if existing_sync:
        return existing_sync

    # 2. Support ONLY entity_type="TRIAGE" and operation="CREATE"
    if sync_data.entity_type != "TRIAGE" or sync_data.operation != "CREATE":
        raise HTTPException(
            status_code=400,
            detail="Only entity_type='TRIAGE' and operation='CREATE' are supported."
        )

    # 3. Validate nested triage payload
    if not isinstance(sync_data.payload, dict):
        raise HTTPException(
            status_code=400,
            detail="Invalid triage payload: payload must be an object."
        )

    try:
        triage_create = TriageAssessmentCreate(**sync_data.payload)
    except (ValidationError, TypeError, ValueError) as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid triage payload: {str(e)}"
        )

    # 4. Check patient existence
    patient = db.query(Patient).filter(
        Patient.id == triage_create.patient_id
    ).first()
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # 5. Check facility existence
    facility = db.query(Facility).filter(
        Facility.id == triage_create.facility_id
    ).first()
    if not facility:
        raise HTTPException(
            status_code=404,
            detail="Facility not found."
        )

    # 6. Create TriageAssessment and SyncAction atomically in ONE transaction
    symptoms_val = (
        ", ".join(triage_create.symptoms)
        if isinstance(triage_create.symptoms, list)
        else triage_create.symptoms
    )

    new_triage = TriageAssessment(
        patient_id=triage_create.patient_id,
        facility_id=triage_create.facility_id,
        assessed_by=current_user.id,
        chief_complaint=triage_create.chief_complaint,
        symptoms=symptoms_val,
        temperature=triage_create.temperature,
        heart_rate=triage_create.heart_rate,
        respiratory_rate=triage_create.respiratory_rate,
        spo2=triage_create.spo2,
        blood_pressure=triage_create.blood_pressure,
        urgency_level=triage_create.urgency_level,
        notes=triage_create.notes
    )
    db.add(new_triage)
    db.flush()

    now = datetime.utcnow()
    new_sync = SyncAction(
        client_event_id=sync_data.client_event_id,
        entity_type=sync_data.entity_type,
        operation=sync_data.operation,
        payload=sync_data.payload,
        entity_id=new_triage.id,
        status="PROCESSED",
        processed_at=now,
        created_at=now
    )
    db.add(new_sync)

    try:
        db.commit()
        db.refresh(new_sync)
        return new_sync
    except IntegrityError:
        db.rollback()
        existing_sync = db.query(SyncAction).filter(
            SyncAction.client_event_id == sync_data.client_event_id
        ).first()
        if existing_sync:
            return existing_sync
        raise
