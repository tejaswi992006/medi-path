from fastapi import FastAPI

app = FastAPI(
    title="Medi-Path API",
    description="Rural Healthcare Access, Continuity and Referral Support System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "Medi-Path Backend is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}