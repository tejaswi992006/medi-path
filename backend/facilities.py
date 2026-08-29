from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from models import Facility


router = APIRouter(prefix="/facilities", tags=["Facilities"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class FacilityCreate(BaseModel):
    name: str
    facility_type: str
    address: str | None = None
    district: str | None = None
    state: str | None = None
    phone: str | None = None


class FacilityResponse(BaseModel):
    id: int
    name: str
    facility_type: str
    address: str | None = None
    district: str | None = None
    state: str | None = None
    phone: str | None = None

    class Config:
        from_attributes = True


@router.post("/", response_model=FacilityResponse)
def create_facility(
    facility: FacilityCreate,
    db: Session = Depends(get_db)
):

    new_facility = Facility(
        name=facility.name,
        facility_type=facility.facility_type,
        address=facility.address,
        district=facility.district,
        state=facility.state,
        phone=facility.phone
    )

    db.add(new_facility)
    db.commit()
    db.refresh(new_facility)

    return new_facility


@router.get("/", response_model=list[FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()