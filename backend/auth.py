from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
import hashlib

from database import SessionLocal
from models import User
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# -------------------------
# JWT settings
# -------------------------

SECRET_KEY = "medi-path-secret-key-change-later"
ALGORITHM = "HS256"

security = HTTPBearer()


# -------------------------
# Database dependency
# -------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# -------------------------
# Request schema
# -------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


# -------------------------
# Response schema
# -------------------------

class LoginResponse(BaseModel):
    access_token: str
    token_type: str


# -------------------------
# Password hashing
# -------------------------

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# -------------------------
# Login
# -------------------------

@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_hash = hash_password(login_data.password)

    if password_hash != user.password_hash:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
        "user_id": user.id,
        "role_id": user.role_id,
        "facility_id": user.facility_id
    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -------------------------
# Get current logged-in user
# -------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Token does not contain user_id"
            )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
    )
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# -------------------------
# Current user endpoint
# -------------------------

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role_id": current_user.role_id,
        "facility_id": current_user.facility_id
    }