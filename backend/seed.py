from datetime import date, datetime
import hashlib

from database import SessionLocal
from models import (
    Role,
    Facility,
    User,
    Patient,
    MedicalRecord,
    Appointment,
    Referral,
    FollowUp,
)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


db = SessionLocal()

try:
    # -------------------------
    # ROLES
    # -------------------------

    patient_role = db.query(Role).filter(Role.name == "Patient").first()
    if not patient_role:
        patient_role = Role(name="Patient")
        db.add(patient_role)

    doctor_role = db.query(Role).filter(Role.name == "Doctor").first()
    if not doctor_role:
        doctor_role = Role(name="Doctor")
        db.add(doctor_role)

    admin_role = db.query(Role).filter(Role.name == "Admin").first()
    if not admin_role:
        admin_role = Role(name="Admin")
        db.add(admin_role)

    db.flush()

    # -------------------------
    # FACILITIES
    # -------------------------

    phc = db.query(Facility).filter(
        Facility.name == "Medi-Path Demo PHC"
    ).first()

    if not phc:
        phc = Facility(
            name="Medi-Path Demo PHC",
            facility_type="PHC",
            address="Demo Address",
            district="Demo District",
            state="Telangana",
            phone="9000000001",
        )
        db.add(phc)

    hospital = db.query(Facility).filter(
        Facility.name == "Medi-Path Demo District Hospital"
    ).first()

    if not hospital:
        hospital = Facility(
            name="Medi-Path Demo District Hospital",
            facility_type="Hospital",
            address="Demo Hospital Address",
            district="Demo District",
            state="Telangana",
            phone="9000000002",
        )
        db.add(hospital)

    db.flush()

    # -------------------------
    # USERS
    # -------------------------

    patient_user = db.query(User).filter(
        User.email == "demo.patient@medipath.test"
    ).first()

    if not patient_user:
        patient_user = User(
            name="Demo Patient",
            email="demo.patient@medipath.test",
            password_hash=hash_password("Demo@123"),
            role_id=patient_role.id,
            facility_id=phc.id,
        )
        db.add(patient_user)

    doctor_user = db.query(User).filter(
        User.email == "demo.doctor@medipath.test"
    ).first()

    if not doctor_user:
        doctor_user = User(
            name="Demo Doctor",
            email="demo.doctor@medipath.test",
            password_hash=hash_password("Doctor@123"),
            role_id=doctor_role.id,
            facility_id=phc.id,
        )
        db.add(doctor_user)

    admin_user = db.query(User).filter(
        User.email == "demo.admin@medipath.test"
    ).first()

    if not admin_user:
        admin_user = User(
            name="Demo Admin",
            email="demo.admin@medipath.test",
            password_hash=hash_password("Admin@123"),
            role_id=admin_role.id,
            facility_id=phc.id,
        )
        db.add(admin_user)

    db.flush()

    # -------------------------
    # PATIENT
    # -------------------------

    patient = db.query(Patient).filter(
        Patient.user_id == patient_user.id
    ).first()

    if not patient:
        patient = Patient(
            user_id=patient_user.id,
            date_of_birth=date(2005, 6, 15),
            gender="Female",
            phone="9000000010",
            address="Demo Patient Address",
            facility_id=phc.id,
        )
        db.add(patient)

    db.flush()

    # -------------------------
    # MEDICAL RECORD
    # -------------------------

    medical_record = db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient.id
    ).first()

    if not medical_record:
        medical_record = MedicalRecord(
            patient_id=patient.id,
            doctor_id=doctor_user.id,
            diagnosis="Demo diagnosis",
            symptoms="Demo symptoms",
            treatment="Demo treatment",
            notes="Synthetic demo medical record",
        )
        db.add(medical_record)

    # -------------------------
    # APPOINTMENT
    # -------------------------

    appointment = db.query(Appointment).filter(
        Appointment.patient_id == patient.id
    ).first()

    if not appointment:
        appointment = Appointment(
            patient_id=patient.id,
            doctor_id=doctor_user.id,
            facility_id=phc.id,
            appointment_date=datetime(2026, 9, 1, 10, 0),
            status="Scheduled",
            reason="Demo consultation",
        )
        db.add(appointment)

    # -------------------------
    # REFERRAL
    # -------------------------

    referral = db.query(Referral).filter(
        Referral.patient_id == patient.id
    ).first()

    if not referral:
        referral = Referral(
            patient_id=patient.id,
            from_facility_id=phc.id,
            to_facility_id=hospital.id,
            referred_by=doctor_user.id,
            reason="Demo referral for specialist consultation",
            status="Pending",
            notes="Synthetic demo referral",
        )
        db.add(referral)

    db.flush()

    # -------------------------
    # FOLLOW-UP
    # -------------------------

    follow_up = db.query(FollowUp).filter(
        FollowUp.patient_id == patient.id
    ).first()

    if not follow_up:
        follow_up = FollowUp(
            patient_id=patient.id,
            referral_id=referral.id,
            doctor_id=doctor_user.id,
            follow_up_date=datetime(2026, 9, 10, 10, 0),
            status="Scheduled",
            notes="Synthetic demo follow-up",
        )
        db.add(follow_up)

    db.commit()

    print("Seed data inserted successfully!")
    print()
    print("Demo Patient ID:", patient.id)
    print("Demo Doctor ID:", doctor_user.id)
    print("Demo PHC ID:", phc.id)
    print("Demo Hospital ID:", hospital.id)
    print("Referral ID:", referral.id)
    print("Follow-up ID:", follow_up.id)

except Exception as e:
    db.rollback()
    print("Error while inserting seed data:")
    print(e)

finally:
    db.close()