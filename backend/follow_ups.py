from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import FollowUp
from schemas import FollowUpCreate, FollowUpResponse


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


@router.post("/", response_model=FollowUpResponse)
def create_follow_up(
    follow_up: FollowUpCreate,
    db: Session = Depends(get_db)
):
    new_follow_up = FollowUp(
        patient_id=follow_up.patient_id,
        referral_id=follow_up.referral_id,
        doctor_id=follow_up.doctor_id,
        follow_up_date=follow_up.follow_up_date,
        status=follow_up.status,
        notes=follow_up.notes
    )

    db.add(new_follow_up)
    db.commit()
    db.refresh(new_follow_up)

    return new_follow_up


@router.get("/", response_model=list[FollowUpResponse])
def get_follow_ups(db: Session = Depends(get_db)):
    return db.query(FollowUp).all()