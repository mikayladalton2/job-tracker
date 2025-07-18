from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
from pydantic import BaseModel
from typing import Optional
from schemas import JobCreate, JobOut
from typing import List


app = FastAPI(
    title="Job Tracker API",
    description="Track your job applications, update statuses, and manage job hunting progress.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/jobs", response_model=List[JobOut], tags=["Jobs"], summary="List all jobs")
def get_jobs(
    status: Optional[str] = None, # make status filter optional
    sort: Optional[str] = None,
    limit: int = 10,  # default limit to 10
    page: int = 1, # default to page 1

    db: Session = Depends(get_db)
):
    query = db.query(models.JobApplication)
    if status:
        query = query.filter(models.JobApplication.status == status)
    if sort == "latest":
        query = query.order_by(models.JobApplication.date_applied.desc())
    offset = (page-1) * limit
    return query.offset(offset).limit(limit).all()

@app.post("/jobs", response_model=JobOut, tags=["Jobs"], summary="Create a new job")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = models.JobApplication(**job.dict())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.get("/jobs/{job_id}", response_model=JobOut, tags=["Jobs"], summary="Get a job by ID")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobApplication).filter(models.JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

class JobUpdate(BaseModel):
    status: str

@app.put("/jobs/{job_id}", response_model=JobOut, tags=["Jobs"], summary="Update job status")
def update_job(job_id: int, job_update: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(models.JobApplication).filter(models.JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.status = job_update.status
    db.commit()
    db.refresh(job)
    return job

@app.delete("/jobs/{job_id}", tags=["Jobs"], summary="Delete a job")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobApplication).filter(models.JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return{"message": "Job successfully removed"}



@app.get("/", include_in_schema=False)
def read_root():
    return {"message": "Welcome to the Job Tracker API. Use /docs to explore the endpoints."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)