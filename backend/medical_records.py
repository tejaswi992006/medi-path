from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import MedicalRecord, Patient, User
from schemas import MedicalRecordCreate, MedicalRecordResponse
from auth import get_current_user
from models import User

router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MedicalRecordResponse)
def create_medical_record(
    record: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check whether patient exists
    patient = db.query(Patient).filter(
        Patient.id == record.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # Check whether doctor exists
    doctor = db.query(User).filter(
        User.id == record.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found."
        )

    # Create medical record
    new_record = MedicalRecord(
        patient_id=record.patient_id,
        doctor_id=record.doctor_id,
        diagnosis=record.diagnosis,
        symptoms=record.symptoms,
        treatment=record.treatment,
        notes=record.notes
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@router.get("/", response_model=list[MedicalRecordResponse])
def get_medical_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(MedicalRecord).all()