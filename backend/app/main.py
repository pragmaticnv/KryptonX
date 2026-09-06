import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .api.routes import router

load_dotenv()

app = FastAPI(
    title="KryptonX Thermal Intelligence API",
    description="Backend API for Smart India Hackathon Problem Statement SIH26162: AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources",
    version="0.1.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "product": "KryptonX",
        "tagline": "FIRMS detects the heat. KryptonX understands the event.",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
