from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.apply import apply_router
from server.routes.category import category_router
from server.routes.jobs import job_router
from server.routes.recomend import recommendation_router
from server.routes.user import user
from server.routes.userProfileRoute import user_profile_router

from fastapi.responses import HTMLResponse
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000","https://rojgar-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user, tags=["User"])
app.include_router(job_router, prefix="/api", tags=["Jobs"])
app.include_router(apply_router, prefix="/api", tags=["Applications"])
app.include_router(recommendation_router, prefix="/api",
                   tags=["Recommendation"])
app.include_router(category_router, prefix="/api", tags=["Category"])
app.include_router(user_profile_router, prefix="/api", tags=["UserProfile"])

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Rojgar</title>
        </head>
        <body style='    
        display: flex;
        height: -webkit-fill-available;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        '>
        <h1>Welcome To Rojgar Backend</h1><br>
            <a href='/docs'>Go to Docs</a>
        </body>
    </html>
    """


# Swagger UI group
app.title = "My API Documentation"
app.description = "API documentation for my application"
app.version = "1.0.0"
