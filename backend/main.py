from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx

# Import shared config (also triggers DNS patch and env loading)
from config import ALLOWED_ORIGINS, SUPABASE_URL, HEADERS, is_cloud_deployment
import os
# Import all route modules
from routes.attendance_routes import router as attendance_router
from routes.sessions_routes import router as sessions_router
from routes.scores_routes import router as scores_router
from routes.students_routes import router as students_router
from routes.leaderboard_routes import router as leaderboard_router
from routes.timeline_routes import router as timeline_router
from routes.activities_routes import router as activities_router
from routes.join_us_routes import router as join_us_router
from routes.publications_routes import router as publications_router
from routes.cv_routes import router as cv_router
from routes.papers_routes import router as papers_router
from routes.metrics_routes import router as metrics_router
from routes.batch_stats_routes import router as batch_stats_router

app = FastAPI(title="SRL Backend API")

# ✅ CORS MIDDLEWARE — THIS MUST BE THE FIRST THING ADDED TO THE APP
# If this is not first, CORS headers will NOT be sent on error responses
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        raise exc
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": f"An unexpected error occurred: {str(exc)}"
        }
    )

# Register all routers
app.include_router(attendance_router)
app.include_router(sessions_router)
app.include_router(scores_router)
app.include_router(students_router)
app.include_router(leaderboard_router)
app.include_router(timeline_router)
app.include_router(activities_router)
app.include_router(join_us_router)
app.include_router(publications_router)
app.include_router(cv_router)
app.include_router(papers_router)
app.include_router(metrics_router)
app.include_router(batch_stats_router)


@app.get("/")
def read_root():
    return {"status": "StudentsResearchLab backend running"}

@app.get("/api/health")
async def health_check():
    supabase_status = "connected"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/", headers=HEADERS)
            res.raise_for_status()
    except Exception as e:
        supabase_status = f"disconnected: {str(e)}"

    return {
        "status": "✅ ok",
        "allowed_origins": ALLOWED_ORIGINS,
        "supabase_url_set": bool(os.environ.get("SUPABASE_URL")),
        "supabase_key_set": bool(os.environ.get("SUPABASE_KEY")),
        "frontend_url_env": os.environ.get("FRONTEND_URL", "NOT SET"),
        "render_detected": bool(os.environ.get("RENDER")),
    }
