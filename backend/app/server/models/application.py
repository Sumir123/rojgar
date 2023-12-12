from pydantic import BaseModel
from fastapi import UploadFile, File


class Application(BaseModel):
    user_id: str
    job_id: str
    resume: UploadFile = File(..., description="Curriculum Vitae (PDF file)")
    cover_letter: UploadFile = File(
        None, description="Cover Letter (PDF file, optional)")
