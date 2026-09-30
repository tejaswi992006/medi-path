from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from patients import router as patients_router
from users import router as users_router
from facilities import router as facilities_router
from doctors import router as doctors_router
from medical_records import router as medical_records_router
from appointments import router as appointments_router
from referrals import router as referrals_router
from follow_ups import router as follow_ups_router
from auth import router as auth_router

app = FastAPI(
    title="Medi-Path API",
    description="Rural Healthcare Access, Continuity and Referral Support System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#routers
app.include_router(patients_router)
app.include_router(users_router)
app.include_router(facilities_router)
app.include_router(doctors_router)
app.include_router(medical_records_router)
app.include_router(appointments_router)
app.include_router(referrals_router)
app.include_router(follow_ups_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Medi-Path Backend is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}