import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Apply a DNS bypass monkeypatch for Supabase due to possible local ISP DNS blocks/NXDOMAINs
# MUST be done before importing httpx so anyio picks up our patched getaddrinfo
if SUPABASE_URL:
    try:
        supabase_host = urlparse(SUPABASE_URL).hostname
        old_getaddrinfo = socket.getaddrinfo
        def new_getaddrinfo(*args, **kwargs):
            if args[0] and supabase_host in str(args[0]):
                return old_getaddrinfo('104.18.38.10', *args[1:], **kwargs)
            return old_getaddrinfo(*args, **kwargs)
        socket.getaddrinfo = new_getaddrinfo
        print(f"Applied DNS patch for {supabase_host} to bypass local DNS blocks")
    except Exception as e:
        print(f"Failed to apply DNS patch: {e}")

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Supabase credentials not found. Make sure to set SUPABASE_URL and SUPABASE_KEY in .env")

# Headers for PostgREST API
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

@app.get("/")
def read_root():
    return {"status": "API running with direct Supabase API connection ✅"}

@app.get("/api/attendance")
async def get_all_attendance():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/attendance?select=*", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/attendance/{student_id}")
async def get_student_attendance(student_id: int):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,status&student_id=eq.{student_id}&order=date",
                headers=HEADERS
            )
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scores")
async def get_all_scores():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/debate_scores?select=*", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scores/{student_id}")
async def get_student_scores(student_id: int):
    raise HTTPException(status_code=501, detail="Not Implemented securely for debate_scores yet")

@app.get("/api/students")
async def get_students():
    try:
        async with httpx.AsyncClient() as client:
            scores_res = await client.get(f"{SUPABASE_URL}/rest/v1/debate_scores?select=*", headers=HEADERS)
            scores_res.raise_for_status()

            scores = scores_res.json()

            result = []
            for sc in scores:
                result.append({
                    "id": sc["enrollment_no"],
                    "enrollment_no": sc["enrollment_no"],
                    "name": sc.get("student_name", "Unknown Student"),
                    "attendance_percentage": 0.0,
                    "total_score": sc.get("total_points", 0)
                })
                
            return {"students": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
