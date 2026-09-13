
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import FollowUp, Patient, Referral, User
from schemas import FollowUpCreate, FollowUpResponse, FollowUpStageUpdate
from auth import get_current_user


router = APIRouter(
    prefix="/follow-ups",
    tags=["Follow-Ups"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE FOLLOW-UP
@router.post("/", response_model=FollowUpResponse)
def create_follow_up(
    follow_up: FollowUpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only doctors can create follow-ups
    if not current_user.role or current_user.role.name.lower() != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create follow-ups."
        )

    # Check whether patient exists
    patient = db.query(Patient).filter(
        Patient.id == follow_up.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # Check whether doctor exists
    doctor = db.query(User).filter(
        User.id == follow_up.doctor_id
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

    # Doctor can only create follow-ups as themselves
    if current_user.id != follow_up.doctor_id:
        raise HTTPException(
            status_code=403,
            detail="You can only create follow-ups as yourself."
        )

    # Check referral only if one was provided
    if follow_up.referral_id is not None:
        referral = db.query(Referral).filter(
            Referral.id == follow_up.referral_id
        ).first()

        if not referral:
            raise HTTPException(
                status_code=404,
                detail="Referral not found."
            )

    # Create follow-up
    new_follow_up = FollowUp(
        patient_id=follow_up.patient_id,
        referral_id=follow_up.referral_id,
        doctor_id=follow_up.doctor_id,
        follow_up_date=follow_up.follow_up_date,
        status=follow_up.status,
        tracking_stage=follow_up.tracking_stage,
        notes=follow_up.notes
    )

    db.add(new_follow_up)
    db.commit()
    db.refresh(new_follow_up)

    return new_follow_up

@router.patch("/{follow_up_id}/tracking-stage", response_model=FollowUpResponse)
def update_tracking_stage(
    follow_up_id: int,
    stage_update: FollowUpStageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    allowed_stages = [
        "Referral Created",
        "Referral Accepted",
        "Appointment Scheduled",
        "Consultation",
        "Follow-up",
        "Treatment Completed"
    ]

    if stage_update.tracking_stage not in allowed_stages:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid tracking stage. Allowed stages: {allowed_stages}"
        )

    follow_up = db.query(FollowUp).filter(
        FollowUp.id == follow_up_id
    ).first()

    if not follow_up:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found"
        )

    follow_up.tracking_stage = stage_update.tracking_stage

    db.commit()
    db.refresh(follow_up)

    return follow_up
# GET ALL FOLLOW-UPS
@router.get("/", response_model=list[FollowUpResponse])
def get_follow_ups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FollowUp).all()


# GET ONE FOLLOW-UP
@router.get("/{follow_up_id}", response_model=FollowUpResponse)
def get_follow_up(
    follow_up_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    follow_up = db.query(FollowUp).filter(
        FollowUp.id == follow_up_id
    ).first()

    if not follow_up:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found."
        )

    return follow_up
