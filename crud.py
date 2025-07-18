# create, read, update, and delete (CRUD)
from sqlalchemy.orm import Session
from models import JobApplication
from schemas import JobCreate

def create_job(db: Session, job: JobCreate):
    db_job = JobApplication(
        company = job.company,
        position = job.position,
        status = job.status,
        date_applied = job.date_applied,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_jobs(db: Session):
    return db.query(JobApplication).all()