from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from pydantic import BaseModel


router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserCreate(BaseModel):
    name: str
    email: str
    password_hash: str
    role_id: int
    facility_id: int | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role_id: int
    facility_id: int | None = None

    class Config:
        from_attributes = True


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=user.password_hash,
        role_id=user.role_id,
        facility_id=user.facility_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()