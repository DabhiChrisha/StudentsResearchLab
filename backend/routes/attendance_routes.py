import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


async def fetch_all_records(client, url: str):
    all_chunks = []
    offset = 0
    limit = 1000
    while True:
        req_url = f"{url}{'&' if '?' in url else '?'}offset={offset}&limit={limit}"
        res = await client.get(req_url, headers=HEADERS)
        res.raise_for_status()
        chunk = res.json()
        all_chunks.extend(chunk)
        if len(chunk) < limit:
            break
        offset += limit
    return all_chunks

@router.get("/attendance")
async def get_all_attendance():
    try:
        async with httpx.AsyncClient() as client:
            records = await fetch_all_records(client, f"{SUPABASE_URL}/rest/v1/attendance?select=*")
            return {"records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/attendance/{student_id}")
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


@router.get("/attendance/{enrollment_no}/percentage")
async def get_student_attendance_percentage(enrollment_no: str):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,hours&enrollment_no=eq.{enrollment_no}",
                headers=HEADERS
            )
            res.raise_for_status()
            records = res.json()

            if not records:
                return {"attendance_percentage": 0.0}

            daily_hours = {}
            for r in records:
                date = r.get("date")
                hours = r.get("hours") or 0
                if date:
                    daily_hours[date] = daily_hours.get(date, 0) + float(hours)

            total_recorded_days = len(daily_hours)
            if total_recorded_days == 0:
                return {"attendance_percentage": 0.0}

            present_days = sum(1 for h in daily_hours.values() if h > 0)
            percentage = (present_days / total_recorded_days) * 100.0

            return {"attendance_percentage": round(percentage, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/attendance/{enrollment_no}/srl_percentage")
async def get_student_srl_attendance_percentage(enrollment_no: str):
    try:
        async with httpx.AsyncClient() as client:
            # Fetch srl_sessions dates
            srl_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            srl_res.raise_for_status()
            srl_records = srl_res.json()
            srl_dates = {r.get("session_date") for r in srl_records if r.get("session_date")}

            # Fetch attendance for the student
            att_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,hours&enrollment_no=eq.{enrollment_no}",
                headers=HEADERS
            )
            att_res.raise_for_status()
            att_records = att_res.json()

            daily_hours = {}
            for r in att_records:
                date = r.get("date")
                if date and date in srl_dates:
                    hours = r.get("hours") or 0
                    daily_hours[date] = daily_hours.get(date, 0) + float(hours)

            total_recorded_srl_sessions = len(srl_dates)
            if total_recorded_srl_sessions == 0:
                return {"srl_attendance_percentage": 0.0}

            present_sessions = sum(1 for h in daily_hours.values() if h > 0)
            percentage = (present_sessions / total_recorded_srl_sessions) * 100.0

            return {"srl_attendance_percentage": round(percentage, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
