from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Referral, User
from schemas import ReferralCreate, ReferralResponse
from auth import get_current_user


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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only doctors can create referrals
    if current_user.role_id != 2:
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create referrals"
        )

    new_referral = Referral(
        patient_id=referral.patient_id,
        from_facility_id=referral.from_facility_id,
        to_facility_id=referral.to_facility_id,
        referred_by=current_user.id,
        reason=referral.reason,
        status=referral.status,
        notes=referral.notes
    )

    db.add(new_referral)
    db.commit()
    db.refresh(new_referral)

    return new_referral


@router.get("/", response_model=list[ReferralResponse])
def get_referrals(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    return db.query(Referral).all()