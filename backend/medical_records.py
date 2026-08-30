
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import MedicalRecord, Patient, User
from schemas import MedicalRecordCreate, MedicalRecordResponse
from auth import get_current_user


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


# CREATE MEDICAL RECORD
@router.post("/", response_model=MedicalRecordResponse)
def create_medical_record(
    record: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only doctors can create medical records
    if not current_user.role or current_user.role.name.lower() != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create medical records."
        )

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

    # Check whether the selected user is actually a doctor
    if not doctor.role or doctor.role.name.lower() != "doctor":
        raise HTTPException(
            status_code=400,
            detail="The selected doctor_id does not belong to a doctor."
        )

    # Make sure the logged-in doctor creates the record
    if current_user.id != record.doctor_id:
        raise HTTPException(
            status_code=403,
            detail="You can only create medical records as yourself."
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


# GET ALL MEDICAL RECORDS
@router.get("/", response_model=list[MedicalRecordResponse])
def get_medical_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(MedicalRecord).all()


# GET ONE MEDICAL RECORD
@router.get("/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    medical_record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id
    ).first()

    if not medical_record:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found."
        )

    return medical_record

