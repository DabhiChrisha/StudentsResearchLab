from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import shared config (also triggers DNS patch and env loading)
from config import origins

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/")
def read_root():
    return {"status": "StudentsResearchLab backend running"}
