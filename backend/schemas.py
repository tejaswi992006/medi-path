from datetime import date,datetime
from pydantic import BaseModel


class PatientCreate(BaseModel):
    user_id: int
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None
    facility_id: int | None = None


class PatientResponse(BaseModel):
    id: int
    user_id: int
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None
    facility_id: int | None = None

    class Config:
        from_attributes = True
        
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
from datetime import date, datetime
from pydantic import BaseModel


class PatientCreate(BaseModel):
    user_id: int
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None
    facility_id: int | None = None


class PatientResponse(BaseModel):
    id: int
    user_id: int
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None
    facility_id: int | None = None

    class Config:
        from_attributes = True


# Medical Record Schemas

class MedicalRecordCreate(BaseModel):
    patient_id: int
    doctor_id: int
    diagnosis: str | None = None
    symptoms: str | None = None
    treatment: str | None = None
    notes: str | None = None


class MedicalRecordResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    diagnosis: str | None = None
    symptoms: str | None = None
    treatment: str | None = None
    notes: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
# Appointment Schemas

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    facility_id: int
    appointment_date: datetime
    status: str = "Scheduled"
    reason: str | None = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    facility_id: int
    appointment_date: datetime
    status: str
    reason: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
class ReferralCreate(BaseModel):
    patient_id: int
    from_facility_id: int
    to_facility_id: int
    referred_by: int
    reason: str | None = None
    status: str = "Pending"
    notes: str | None = None


class ReferralResponse(BaseModel):
    id: int
    patient_id: int
    from_facility_id: int
    to_facility_id: int
    referred_by: int
    reason: str | None = None
    status: str
    referral_date: datetime
    notes: str | None = None

    class Config:
        from_attributes = True
class FollowUpCreate(BaseModel):
    patient_id: int
    referral_id: int | None = None
    doctor_id: int
    follow_up_date: datetime
    status: str = "Scheduled"
    notes: str | None = None


class FollowUpResponse(BaseModel):
    id: int
    patient_id: int
    referral_id: int | None = None
    doctor_id: int
    follow_up_date: datetime
    status: str
    notes: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True