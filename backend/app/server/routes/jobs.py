import datetime
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ASCENDING, DESCENDING
from server.auth.auth import RoleChecker, UserRole
from server.config.db import db
from server.models.jobs import Job

job_router = APIRouter()

ITEMS_PER_PAGE = 10


@job_router.post("/jobs", dependencies=[Depends(RoleChecker([UserRole.EMPLOYER]))])
async def create_job(job: Job):

    job_data = job.dict()
    job_data["timestamp"] = datetime.datetime.now()

    db.jobs.insert_one(job_data)

    return {"message": "Job created successfully"}


@job_router.get("/jobs")
async def get_all_jobs(
    id: List[str] = Query(None),
    price: float = Query(None),
    payment_type: str = Query(None),
    category: str = Query(None),
    employer_id: str = Query(None),
    search_terms: str = Query(None),
    order: str = Query("latest", regex="^(latest|oldest)$"),
    page: str = Query("1"),
):
    filter_params = {}

    if id:
        id_list = [ObjectId(_id) for _id in id]
        filter_params["_id"] = {"$in": id_list}
    if price:
        filter_params["price"] = price
    if payment_type:
        filter_params["payment_type"] = payment_type
    if category:
        filter_params["category"] = category
    if employer_id:
        filter_params["employer_id"] = employer_id

    # Add search terms filter if provided
    if search_terms:
        search_regex = f".*{search_terms}.*"
        filter_params["$or"] = [
            {"title": {"$regex": search_regex, "$options": "i"}},
            {"description": {"$regex": search_regex, "$options": "i"}},
        ]

    total_jobs = db.jobs.count_documents(filter_params)
    total_pages = (total_jobs // ITEMS_PER_PAGE) + \
        (1 if total_jobs % ITEMS_PER_PAGE != 0 else 0)

    page_num = 1  # Default value

    if page.lower() == "all":
        jobs = list(db.jobs.find(filter_params))
    elif page.lower() == "last":
        jobs = list(db.jobs.find(filter_params).sort(
            "_id", DESCENDING).limit(10))
    else:
        try:
            page_num = int(page)

            if page_num < 1:
                page_num = 1
            elif page_num > total_pages:
                page_num = total_pages

            limit = ITEMS_PER_PAGE
            skip = (page_num - 1) * limit

            # Sort the jobs based on the order parameter
            if order == "latest":
                jobs = list(db.jobs.find(filter_params).limit(
                    limit).skip(skip).sort("timestamp", DESCENDING))
            else:  # order == "oldest"
                jobs = list(db.jobs.find(filter_params).limit(
                    limit).skip(skip).sort("timestamp", ASCENDING))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid page value. Please provide a valid page number or 'last' for the last 10 jobs.",
            )

    jobs = [{**job, "_id": str(job["_id"])} for job in jobs]
    return {
        "jobs": jobs,
        "total_jobs": total_jobs,
        "total_pages": total_pages,
        "current_page": page_num,
    }


@job_router.put("/jobs/{job_id}")
async def update_job(job_id: str, job: Job):
    updated_job = job.dict()
    updated_job["timestamp"] = datetime.datetime.now()

    result = db.jobs.update_one(
        {"_id": ObjectId(job_id)}, {"$set": updated_job})

    if result.modified_count == 1:
        return {"message": "Job updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Job not found")

@job_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    result = db.jobs.delete_one({"_id": ObjectId(job_id)})

    if result.deleted_count == 1:
        return {"message": "Job deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Job not found")