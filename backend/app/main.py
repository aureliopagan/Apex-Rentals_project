from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from .database import engine
from .models import user, asset, booking, review

# Create database tables
user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=config("APP_NAME", default="Apex Rentals API"),
    description="API for luxury asset rental platform",
    version="1.0.0",
)

# Configuración de CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # URLs del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Apex Rentals API!", 
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Apex Rentals API"}
