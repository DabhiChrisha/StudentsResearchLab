from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx

# Import shared config (also triggers DNS patch and env loading)
from config import origins, SUPABASE_URL, HEADERS, is_cloud_deployment

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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
        "status": "ok",
        "environment": "production" if is_cloud_deployment else "development",
        "supabase": supabase_status
    }
