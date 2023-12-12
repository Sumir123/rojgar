import os
from datetime import datetime, timedelta
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import (APIRouter, Depends, HTTPException, Request, Response,
                     status)
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from server.auth.auth import RoleChecker, UserRole
from server.config.db import db
from server.models.user import User

load_dotenv()

user = APIRouter()
user_collection = db["users"]

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(email, password):
    user = user_collection.find_one({"email": email})
    if user and verify_password(password, user["password"]):
        return user


def create_access_token(data: dict, expires_delta: int) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@user.post("/register")
async def register(user: User):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password
    user_collection.insert_one(user_data)
    return {"message": "User registered successfully"}


@user.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=access_token_expires.total_seconds(),
    )
    content = {"access_token": access_token, "token_type": "bearer"}
    response = JSONResponse(content=content)
    response.set_cookie(
        key="token",
        value=access_token,
        secure=True,
        samesite="none",
    )
    return response


@user.get("/me")
async def get_current_user(response: Response, request: Request):
    token = request.cookies.get("token")
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = user_collection.find_one({"email": email})
            if user:
                # Remove sensitive information like password before returning the user data
                user.pop("password", None)
                user["_id"] = str(user["_id"])  # Convert ObjectId to string

                # Check if the user profile exists
                user_profile = db.user_profiles.find_one(
                    {"user_id": user["_id"]})
                if user_profile:
                    # Remove the "disabled" field if it exists
                    user_profile.pop("disabled", None)
                else:
                    # Add the "disabled" field with a default value of True or False
                    user["disabled"] = True  # or False

                return user
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found in cookies",
        )


@user.get("/users", dependencies=[Depends(RoleChecker([UserRole.ADMIN]))])
async def get_all_users():
    users = list(user_collection.find())

    # Remove sensitive information like password before returning the user data
    for user in users:
        user.pop("password", None)
        user["_id"] = str(user["_id"])  # Convert ObjectId to string

    return users


@user.get("/users/{user_id}")
async def get_user(user_id: str):
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        # Remove sensitive information like password before returning the user data
        user.pop("password", None)
        user["_id"] = str(user["_id"])  # Convert ObjectId to string

        # Get the user profile information
        user_profile = db.user_profiles.find_one({"user_id": user_id})
        if user_profile:
            user_profile["_id"] = str(user_profile["_id"])
            user["profile"] = user_profile


        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
