from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Referral, User, Patient
from schemas import ReferralCreate, ReferralUpdate, ReferralResponse
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
def get_referrals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Patient can only see their own referrals
    if current_user.role_id == 1:
        patient = db.query(Patient).filter(
            Patient.user_id == current_user.id
        ).first()

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient profile not found"
            )

        return db.query(Referral).filter(
            Referral.patient_id == patient.id
        ).all()

    # Doctors and admins can see referrals
    if current_user.role_id in [2, 3]:
        return db.query(Referral).all()

    raise HTTPException(
        status_code=403,
        detail="You do not have permission to view referrals"
    )


@router.patch("/{referral_id}", response_model=ReferralResponse)
def update_referral(
    referral_id: int,
    referral_update: ReferralUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only doctors and admins can update referrals
    if current_user.role_id not in [2, 3]:
        raise HTTPException(
            status_code=403,
            detail="Only doctors and admins can update referrals"
        )

    # Find the referral
    referral = db.query(Referral).filter(
        Referral.id == referral_id
    ).first()

    if not referral:
        raise HTTPException(
            status_code=404,
            detail="Referral not found"
        )

    # Update allowed fields
    referral.status = referral_update.status

    if referral_update.notes is not None:
        referral.notes = referral_update.notes

    db.commit()
    db.refresh(referral)

    return referral