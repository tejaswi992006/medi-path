from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import TriageAssessment, Patient, Facility, User
from schemas import TriageAssessmentCreate, TriageAssessmentResponse
from auth import get_current_user

router = APIRouter(
    prefix="/triage",
    tags=["Triage"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TriageAssessmentResponse)
def create_triage_assessment(
    triage: TriageAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check whether patient exists
    patient = db.query(Patient).filter(
        Patient.id == triage.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # Check whether facility exists
    facility = db.query(Facility).filter(
        Facility.id == triage.facility_id
    ).first()

    if not facility:
        raise HTTPException(
            status_code=404,
            detail="Facility not found."
        )

    new_triage = TriageAssessment(
        patient_id=triage.patient_id,
        facility_id=triage.facility_id,
        assessed_by=current_user.id,
        chief_complaint=triage.chief_complaint,
        symptoms=", ".join(triage.symptoms) if isinstance(triage.symptoms, list) else triage.symptoms,
        temperature=triage.temperature,
        heart_rate=triage.heart_rate,
        respiratory_rate=triage.respiratory_rate,
        spo2=triage.spo2,
        blood_pressure=triage.blood_pressure,
        urgency_level=triage.urgency_level,
        notes=triage.notes
    )

    db.add(new_triage)
    db.commit()
    db.refresh(new_triage)

    return new_triage


@router.get("/", response_model=list[TriageAssessmentResponse])
def get_triage_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(TriageAssessment).all()


@router.get("/queue", response_model=list[TriageAssessmentResponse])
def get_triage_queue(
    facility_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TriageAssessment)
    if facility_id:
        query = query.filter(TriageAssessment.facility_id == facility_id)
    return query.order_by(TriageAssessment.created_at.desc()).all()
