import mimetypes
import os
from math import ceil
import bson
from bson.objectid import ObjectId
from fastapi import (APIRouter, Depends, File, HTTPException, Query, Response,
                     UploadFile)
from fastapi.responses import StreamingResponse
from server.auth.auth import RoleChecker, UserRole
from server.config.db import db
from server.models.user import User
from server.routes.user import get_current_user

UPLOADS_DIR = "uploads"

apply_router = APIRouter()


@apply_router.post("/apply", dependencies=[Depends(RoleChecker([UserRole.JOBSEEKER]))])
async def create_application(user_id: str, job_id: str, resume: UploadFile = File(...), cover_letter: UploadFile = File(None)):
    # Check if the user has already applied for the job
    existing_application = db.applications.find_one(
        {"user_id": user_id, "job_id": job_id})
    if existing_application:
        raise HTTPException(
            status_code=400, detail="You have already applied for this job")

    resume_filename = os.path.join(UPLOADS_DIR, resume.filename)
    with open(resume_filename, "wb") as f:
        f.write(await resume.read())

    cover_letter_filename = None
    if cover_letter is not None:
        cover_letter_filename = os.path.join(
            UPLOADS_DIR, cover_letter.filename)
        with open(cover_letter_filename, "wb") as f:
            f.write(await cover_letter.read())

    application_data = {
        "user_id": user_id,
        "job_id": job_id,
        "resume_filename": resume_filename,
        "cover_letter_filename": cover_letter_filename,
    }
    db.applications.insert_one(application_data)

    return {"message": "Applied for job successfully"}


@apply_router.get("/application")
async def get_all_applications(
    job_id: str = Query(None),
    user_id: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    current_user: User = Depends(get_current_user),
):
    filter_params = {}

    if job_id:
        filter_params["job_id"] = job_id
    if user_id:
        filter_params["user_id"] = user_id

    # Retrieve the jobs posted by the current user
    jobs_by_user = list(db.jobs.find({"employer_id": current_user["_id"]}))
    job_ids_by_user = [str(job["_id"]) for job in jobs_by_user]

    # Filter applications for jobs posted by the current user
    if job_ids_by_user:
        filter_params["job_id"] = {"$in": job_ids_by_user}

    total_applications = db.applications.count_documents(filter_params)
    total_pages = ceil(total_applications / limit)

    if page < 1:
        page = 1

    applications = list(db.applications.find(
        filter_params).skip((page - 1) * limit).limit(limit))

    application_list = []
    for application in applications:
        application["_id"] = str(application["_id"])

        # Retrieve the user information for the application
        user = db.users.find_one({"_id": ObjectId(application["user_id"])})
        if user:
            user["_id"] = str(user["_id"])
            application["user_name"] = user.get("name", "")
            application["user_email"] = user.get("email", "")

        # Retrieve the job information for the application
        job = db.jobs.find_one({"_id": ObjectId(application["job_id"])})
        if job:
            job["_id"] = str(job["_id"])
            application["job_title"] = job.get("title", "")

        application_list.append(application)

    return {
        "total_applications": total_applications,
        "total_pages": total_pages,
        "current_page": page,
        "applications": application_list,
    }


@apply_router.get("/application/resume/{application_id}")
async def get_application_resume(application_id: str, response: Response):

    try:
        obj_id = ObjectId(application_id)
    except (bson.errors.InvalidId, ValueError):
        raise HTTPException(status_code=400, detail="Invalid application ID")

    application = db.applications.find_one({"_id": obj_id})
    if application:
        # Convert ObjectId to string
        application["_id"] = str(application["_id"])

        resume_filename = application["resume_filename"]
        file_path = f"{resume_filename}"

        # Check if the file exists
        if os.path.isfile(file_path):
            # Set the Content-Type header based on the file type
            file_extension = os.path.splitext(resume_filename)[1]
            content_type = mimetypes.types_map.get(
                file_extension, "application/octet-stream")
            response.headers["Content-Type"] = content_type

            # Set the Content-Disposition header to suggest a filename
            response.headers["Content-Disposition"] = f"inline; filename={resume_filename}"

            # Return the file as a streaming response
            return StreamingResponse(open(file_path, "rb"), media_type=content_type)
        else:
            return {"message": "File not found"}
    else:
        return {"message": "Application not found"}


@apply_router.get("/application/cover_letter/{application_id}")
async def get_application_cover_letter(application_id: str, response: Response):
    try:
        obj_id = ObjectId(application_id)
    except (bson.errors.InvalidId, ValueError):
        raise HTTPException(status_code=400, detail="Invalid application ID")

    application = db.applications.find_one({"_id": obj_id})
    if application:
        # Convert ObjectId to string
        application["_id"] = str(application["_id"])

        cover_letter_filename = application["cover_letter_filename"]
        file_path = f"{cover_letter_filename}"

        # Check if the file exists
        if os.path.isfile(file_path):
            # Set the Content-Type header based on the file type
            file_extension = os.path.splitext(cover_letter_filename)[1]
            if file_extension == ".docx":
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            else:
                content_type = mimetypes.types_map.get(
                    file_extension, "application/octet-stream")

            response.headers["Content-Type"] = content_type

            # Set the Content-Disposition header to suggest a filename and force download
            response.headers["Content-Disposition"] = f"attachment; filename={cover_letter_filename}"

            # Return the file as a streaming response
            return StreamingResponse(open(file_path, "rb"), media_type=content_type)
        else:
            return {"message": "File not found"}
    else:
        return {"message": "Application not found"}


@apply_router.get("/employer/{employer_id}/applications")
async def get_applications_by_employer(employer_id: str):
    # Retrieve the jobs posted by the employer
    jobs = db.jobs.find({"employer_id": employer_id})

    application_list = []

    # Retrieve the applications for each job
    for job in jobs:
        applications = db.applications.find({"job_id": str(job["_id"])})
        for application in applications:
            application["_id"] = str(application["_id"])
            application_list.append(application)

    return application_list


@apply_router.get("/employer/{employer_id}/applicants")
async def get_applications_by_employer(employer_id: str):
    # Retrieve the jobs posted by the employer
    jobs = db.jobs.find({"employer_id": employer_id})

    user_set = set()

    # Retrieve the applications for each job
    for job in jobs:
        applications = db.applications.find({"job_id": str(job["_id"])})

        for application in applications:
            user_id = application.get("user_id")
            if user_id:
                user_set.add(user_id)

    user_list = list(user_set)

    user_applications = []

    # Iterate over the unique user_ids
    for user_id in user_list:
        # Check if the user_id has multiple applications
        applications_count = db.applications.count_documents(
            {"user_id": user_id})
        if applications_count > 1:
            # Retrieve the first application
            application = db.applications.find_one({"user_id": user_id})
            user = db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
                user_applications.append(user)
        else:
            # Retrieve the user information for each user_id
            user = db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
                user_applications.append(user)

    return {"users": user_applications}


@apply_router.get("/applications/me")
async def get_user_applications(current_user: User = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    applications = db.applications.find({"user_id": user_id})

    application_list = []
    for application in applications:
        application["_id"] = str(application["_id"])
        application_list.append(application)

    return application_list
