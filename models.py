from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    position = Column(String)
    status = Column(String, default="Applied", index=True)  # Applied, Interviewed, Offer, Rejected
    date_applied = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    description = Column(Text, nullable=True)
