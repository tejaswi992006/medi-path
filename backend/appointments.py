from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Appointment, Patient, User, Facility
from schemas import AppointmentCreate, AppointmentResponse
from auth import get_current_user
from models import User

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check whether patient exists
    patient = db.query(Patient).filter(
        Patient.id == appointment.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # Check whether doctor exists
    doctor = db.query(User).filter(
        User.id == appointment.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found."
        )

    # Check whether facility exists
    facility = db.query(Facility).filter(
        Facility.id == appointment.facility_id
    ).first()

    if not facility:
        raise HTTPException(
            status_code=404,
            detail="Facility not found."
        )

    # Create appointment
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        facility_id=appointment.facility_id,
        appointment_date=appointment.appointment_date,
        status=appointment.status,
        reason=appointment.reason
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment


@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Appointment).all()