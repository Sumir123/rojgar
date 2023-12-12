from typing import List
from pydantic import BaseModel, Field


class User(BaseModel):
    name: str = Field(..., description="Name of the user")
    category: str = Field(..., description="Preferred category")
    phone: str = Field(..., description="Phone number")
    email: str = Field(..., description="Email address")
    password: str = Field(..., description="Password")
    role: str = Field(..., description="User role",
                      pattern="^(employer|jobseeker|admin)$")


class UserProfile(BaseModel):

    title: str
    skills: List[str]
    education: List[str]
    experiences: List[str]
    bio: str
