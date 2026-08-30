
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Appointment, Patient, User, Facility
from schemas import AppointmentCreate, AppointmentResponse
from auth import get_current_user


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


# CREATE APPOINTMENT
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

    # Check whether selected user is actually a doctor
    if not doctor.role or doctor.role.name.lower() != "doctor":
        raise HTTPException(
            status_code=400,
            detail="The selected doctor_id does not belong to a doctor."
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

    # Only patients and doctors can create appointments
    if not current_user.role:
        raise HTTPException(
            status_code=403,
            detail="User role not found."
        )

    user_role = current_user.role.name.lower()

    if user_role not in ["patient", "doctor"]:
        raise HTTPException(
            status_code=403,
            detail="Only patients and doctors can create appointments."
       )

    # Doctors can only create appointments for themselves
    if user_role == "doctor" and current_user.id != appointment.doctor_id:
        raise HTTPException(
           status_code=403,
           detail="A doctor can only create appointments for themselves."
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


# GET ALL APPOINTMENTS
@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Appointment).all()


# GET ONE APPOINTMENT
@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found."
        )

    return appointment
