from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from model.flood_detector import FloodDetector

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize flood detector
flood_detector = FloodDetector()

@app.post("/api/detect-flood")
async def detect_flood(file: UploadFile = File(...)):
    """
    Endpoint to detect floods in uploaded satellite imagery
    """
    contents = await file.read()
    results = flood_detector.detect_flood(contents)
    
    return results 