from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    users = relationship("User", back_populates="role")


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    facility_type = Column(String(50), nullable=False)
    address = Column(Text)
    district = Column(String(100))
    state = Column(String(100))
    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="facility")
    patients = relationship("Patient", back_populates="facility")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", back_populates="users")
    facility = relationship("Facility", back_populates="users")

    patients = relationship(
        "Patient",
        back_populates="user",
        uselist=False
    )


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    date_of_birth = Column(Date)
    gender = Column(String(30))
    phone = Column(String(20))
    address = Column(Text)

    facility_id = Column(Integer, ForeignKey("facilities.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="patients")
    facility = relationship("Facility", back_populates="patients")

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    diagnosis = Column(Text)
    symptoms = Column(Text)
    treatment = Column(Text)
    notes = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship("Patient")
    doctor = relationship("User")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    facility_id = Column(
        Integer,
        ForeignKey("facilities.id"),
        nullable=False
    )

    appointment_date = Column(DateTime, nullable=False)

    status = Column(
        String(30),
        default="Scheduled",
        nullable=False
    )

    reason = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship("Patient")
    doctor = relationship("User")
    facility = relationship("Facility")

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    from_facility_id = Column(
        Integer,
        ForeignKey("facilities.id"),
        nullable=False
    )

    to_facility_id = Column(
        Integer,
        ForeignKey("facilities.id"),
        nullable=False
    )

    referred_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    reason = Column(Text)

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    referral_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    notes = Column(Text)

    patient = relationship("Patient")
    from_facility = relationship(
        "Facility",
        foreign_keys=[from_facility_id]
    )
    to_facility = relationship(
        "Facility",
        foreign_keys=[to_facility_id]
    )
    referrer = relationship("User")


class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    referral_id = Column(
        Integer,
        ForeignKey("referrals.id"),
        nullable=True
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    follow_up_date = Column(DateTime, nullable=False)

    status = Column(
        String(30),
        default="Scheduled",
        nullable=False
    )

    notes = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship("Patient")
    referral = relationship("Referral")
    doctor = relationship("User")