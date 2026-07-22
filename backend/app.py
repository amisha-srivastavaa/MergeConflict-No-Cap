from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.scan import router as scan_router
from database.database import Base, engine

# Create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillScope API",
    version="1.0.0",
    description="AI Skill Description vs Behavior Mismatch Detector"
)

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(scan_router)


@app.get("/")
def root():
    return {
        "name": "SkillScope API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }