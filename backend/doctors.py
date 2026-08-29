from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from users import UserResponse


router = APIRouter(prefix="/doctors", tags=["Doctors"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[UserResponse])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role_id == 2).all()