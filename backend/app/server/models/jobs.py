from pydantic import BaseModel
from typing import List


class Job(BaseModel):
    employer_id: str
    title: str
    description: str
    skills: List[str]
    price: float
    payment_type: str
    category: str
