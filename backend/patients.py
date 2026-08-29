from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Patient
from schemas import PatientCreate, PatientResponse


router = APIRouter(prefix="/patients", tags=["Patients"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    # Check whether this user already has a patient profile
    existing_patient = db.query(Patient).filter(
        Patient.user_id == patient.user_id
    ).first()

    if existing_patient:
        raise HTTPException(
            status_code=400,
            detail="Patient profile already exists for this user."
        )

    # Create new patient
    new_patient = Patient(
        user_id=patient.user_id,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        phone=patient.phone,
        address=patient.address,
        facility_id=patient.facility_id
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


@router.get("/", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()