# schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# what user sends to create a job
class JobCreate(BaseModel):
    company: str
    position: str
    status: Optional[str] = "Applied"
    date_applied: Optional[datetime] = None

# used when returning a job from the API (include ID)
class JobOut(JobCreate):
    id: int
    date_applied: Optional[datetime]
    
    class Config:
        orm_mode = True