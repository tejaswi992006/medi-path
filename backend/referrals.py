from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Referral
from schemas import ReferralCreate, ReferralResponse


router = APIRouter(prefix="/referrals", tags=["Referrals"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ReferralResponse)
def create_referral(
    referral: ReferralCreate,
    db: Session = Depends(get_db)
):
    new_referral = Referral(
        patient_id=referral.patient_id,
        from_facility_id=referral.from_facility_id,
        to_facility_id=referral.to_facility_id,
        referred_by=referral.referred_by,
        reason=referral.reason,
        status=referral.status,
        notes=referral.notes
    )

    db.add(new_referral)
    db.commit()
    db.refresh(new_referral)

    return new_referral


@router.get("/", response_model=list[ReferralResponse])
def get_referrals(db: Session = Depends(get_db)):
    return db.query(Referral).all()