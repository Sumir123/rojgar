from fastapi import APIRouter, Depends, HTTPException, status
from server.routes.user import get_current_user
from server.config.db import db
from server.models.user import User, UserProfile
from typing import Optional


user_profile_router = APIRouter()


@user_profile_router.post("/profile")
async def create_or_update_user_profile(
    profile: UserProfile,
    current_user: User = Depends(get_current_user),
):
    user_id = current_user["_id"]

    existing_profile = db.user_profiles.find_one({"user_id": user_id})

    if existing_profile:

        profile_data = profile.dict(exclude_unset=True)
        updated_profile = db.user_profiles.update_one(
            {"user_id": user_id},
            {"$set": profile_data}
        )

        if updated_profile.modified_count > 0:
            return {"message": "User profile updated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user profile"
            )

    else:
        # Create a new user profile
        profile_data = profile.dict()
        profile_data["user_id"] = user_id

        inserted_profile = db.user_profiles.insert_one(profile_data)
        profile_id = str(inserted_profile.inserted_id)

        return {"message": "User profile created successfully", "profile_id": profile_id}


@user_profile_router.get("/profile")
async def get_user_profile(current_user: User = Depends(get_current_user), user_id: Optional[str] = None):
    if user_id is None:
        user_id = current_user["_id"]

    user_profile = db.user_profiles.find_one({"user_id": user_id})

    if user_profile:
        user_profile["_id"] = str(user_profile["_id"])

        return user_profile

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
