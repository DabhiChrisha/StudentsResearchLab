import asyncio
from datetime import datetime, date, timedelta

import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")

# ── Names to exclude from ALL leaderboard endpoints only ──
LEADERBOARD_EXCLUDED_NAMES = {
    "kandarp dipakkumar gajjar",
    "nancy rajesh patel",
}

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

def get_saturdays_count(start_date: date, end_date: date) -> int:
    count = 0
    current = start_date
    while current <= end_date:
        if current.weekday() == 5:
            count += 1
        current += timedelta(days=1)
    return count

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

async def build_all_time_stats(client):
    """
    Fetches the entire DB state up to the current date and processes the exact
    all-time strings requested: attendance_percentage, total_hours, total_score.
    """
    scores_req = client.get(
        f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points",
        headers=HEADERS
    )
    att_req = fetch_all_records(client, 
        f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours"
    )
    details_req = client.get(
        f"{SUPABASE_URL}/rest/v1/students_details?select=*",
        headers=HEADERS
    )

    scores_res, details_res = await asyncio.gather(scores_req, details_req)
    att_records_result = await att_req

    scores_res.raise_for_status()
    details_res.raise_for_status()

    score_records = scores_res.json()
    attendance_records = att_records_result
    detail_records = details_res.json()

    # Determine start_date from valid attendance records
    valid_dates = []
    for r in attendance_records:
        rdate = r.get("date")
        if rdate:
            try:
                valid_dates.append(datetime.strptime(rdate, "%Y-%m-%d").date())
            except ValueError:
                pass
                
    start_date = min(valid_dates) if valid_dates else datetime.now().date()
    end_date = datetime.now().date()
    total_saturdays = get_saturdays_count(start_date, end_date)

    # Score map
    score_map = {}
    for rec in score_records:
        en = str(rec.get("enrollment_no", "")).strip().upper()
        points = rec.get("points", 0) or 0
        score_map[en] = score_map.get(en, 0) + points

    # Attendance map
    att_map = {}
    for rec in attendance_records:
        en = str(rec.get("enrollment_no", "")).strip().upper()
        if not en: continue
        if en not in att_map:
            att_map[en] = {"hours": 0.0, "saturdays": set()}
            
        hrs = float(rec.get("hours") or 0)
        att_map[en]["hours"] += hrs
        
        rdate = rec.get("date")
        if rdate and hrs > 0:
            try:
                dt = datetime.strptime(rdate, "%Y-%m-%d").date()
                if dt.weekday() == 5:
                    att_map[en]["saturdays"].add(dt)
            except ValueError:
                pass

    # Details map
    detail_map = {}
    for rec in detail_records:
        en = str(rec.get("enrollment_no", "")).strip().upper()
        detail_map[en] = {
            "name": rec.get("student_name") or "Unknown Student",
            "image": rec.get("profile_image"),
            "dept": rec.get("department") or rec.get("dept") or "CE",
            "semester": rec.get("semester") or rec.get("sem") or "6th",
            "div": rec.get("division") or rec.get("div") or "-",
            "batch": rec.get("batch") or "2023-2027",
        }

    all_enrollments = set(score_map.keys()) | set(att_map.keys()) | set(detail_map.keys())
    
    stats_map = {}
    for en in all_enrollments:
        if not en: continue
        
        info = detail_map.get(en, {})
        name = info.get("name", "Unknown Student")
        
        total_score = score_map.get(en, 0)
        
        att_data = att_map.get(en, {"hours": 0.0, "saturdays": set()})
        total_hours = round(att_data["hours"], 1)
        
        attended_saturdays = len(att_data["saturdays"])
        if total_saturdays > 0:
            att_pct = round((attended_saturdays / total_saturdays) * 100)
        else:
            att_pct = 0
            
        stats_map[en] = {
            "enrollment_no": en,
            "name": name,
            "image": info.get("image"),
            "total_score": int(total_score),
            "attendance_percentage": f"{att_pct}%",
            "total_hours": f"{total_hours:.1f} Hrs" if total_hours > 0 else "0 Hrs",
            "dept": info.get("dept", "CE"),
            "semester": info.get("semester", "6th"),
            "div": info.get("div", "-"),
            "batch": info.get("batch", "2023-2027"),
            "_raw_score": total_score,
            "_raw_hours": total_hours,
        }
        
    # Filter out excluded RAs (leaderboard-only exclusion)
    stats_map = {
        en: data for en, data in stats_map.items()
        if data.get("name", "").strip().lower() not in LEADERBOARD_EXCLUDED_NAMES
    }

    return stats_map

@router.get("/attendance_debug")
async def get_attendance_debug():
    async with httpx.AsyncClient(timeout=30.0) as client:
        att_req = client.get(
            f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
            headers=HEADERS
        )
        res = await att_req
        res.raise_for_status()
        return res.json()


@router.get("/leaderboard")
async def get_leaderboard():
    """
    Cumulative Leaderboard endpoint sorting exclusively by all-time Score.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            stats_map = await build_all_time_stats(client)

        students = list(stats_map.values())

        # Extract numeric attendance for tiebreaking (e.g. "40%" -> 40)
        for student in students:
            att_str = student.get("attendance_percentage", "0%")
            try:
                student["_sort_attendance"] = float(att_str.replace("%", ""))
            except (ValueError, AttributeError):
                student["_sort_attendance"] = 0

        # Multi-level sort: score DESC -> attendance DESC -> hours DESC
        students.sort(key=lambda s: (
            s.get("_raw_score", 0),
            s.get("_sort_attendance", 0),
            s.get("_raw_hours", 0),
        ), reverse=True)

        for idx, student in enumerate(students):
            student["rank"] = idx + 1
            student.pop("_raw_score", None)
            student.pop("_raw_hours", None)
            student.pop("_sort_attendance", None)

        return {"leaderboard": students}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leaderboard/top-hours")
async def get_top_hours_leaderboard():
    """
    Top Hours Dedicated endpoint — dynamically uses the current month.
    Shows ONLY hours within the current calendar month (e.g. March 2026).
    """
    from calendar import monthrange

    now = datetime.now()
    cur_year = now.year
    cur_month = now.month
    cur_month_name = MONTH_NAMES[cur_month - 1]
    last_day = monthrange(cur_year, cur_month)[1]
    start_date = f"{cur_year}-{cur_month:02d}-01"
    end_date = f"{cur_year}-{cur_month:02d}-{last_day:02d}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            stats_map = await build_all_time_stats(client)

            # Fetch strictly current-month hours
            att_req = fetch_all_records(client,
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours&date=gte.{start_date}&date=lte.{end_date}"
            )
            monthly_attendance = await att_req

            # Fetch current-month scores for tiebreaking
            scores_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points"
                f"&month=eq.{cur_month_name}&year=eq.{cur_year}",
                headers=HEADERS
            )
            scores_res.raise_for_status()
            score_records = scores_res.json()

        monthly_hours_map = {}
        for rec in monthly_attendance:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            hours = float(rec.get("hours") or 0)
            if en:
                monthly_hours_map[en] = monthly_hours_map.get(en, 0) + hours

        monthly_score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            points = rec.get("points", 0) or 0
            monthly_score_map[en] = monthly_score_map.get(en, 0) + points

        for en, student in stats_map.items():
            student["_sort_monthly_hours"] = monthly_hours_map.get(en, 0)
            student["_sort_monthly_score"] = monthly_score_map.get(en, 0)
            # Extract numeric attendance for tiebreaking (e.g. "40%" -> 40)
            att_str = student.get("attendance_percentage", "0%")
            try:
                student["_sort_attendance"] = float(att_str.replace("%", ""))
            except (ValueError, AttributeError):
                student["_sort_attendance"] = 0

        students = list(stats_map.values())
        # Multi-level sort: hours DESC -> scores DESC -> attendance DESC
        students.sort(key=lambda s: (
            s.get("_sort_monthly_hours", 0),
            s.get("_sort_monthly_score", 0),
            s.get("_sort_attendance", 0),
        ), reverse=True)

        for idx, student in enumerate(students):
            student["rank"] = idx + 1

            # OVERRIDE total_hours — show ONLY current month hours
            mh = student.get("_sort_monthly_hours", 0)
            student["total_hours"] = f"{round(mh, 1):.1f} Hrs" if mh > 0 else "0 Hrs"

            student.pop("_raw_score", None)
            student.pop("_raw_hours", None)
            student.pop("_sort_monthly_hours", None)
            student.pop("_sort_monthly_score", None)
            student.pop("_sort_attendance", None)

        return {
            "leaderboard": students,
            "month": cur_month,
            "year": cur_year,
            "monthName": cur_month_name,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard/monthly")
async def get_monthly_leaderboard(year: int = None, month: int = None):
    """
    Monthly Top Scores endpoint sorting exclusively by the monthly scores.
    """
    now = datetime.now()
    if year is None:
        year = now.year
    if month is None:
        month = now.month

    month_name = MONTH_NAMES[month - 1]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            stats_map = await build_all_time_stats(client)

            scores_req = client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points"
                f"&month=eq.{month_name}&year=eq.{year}",
                headers=HEADERS
            )
            scores_res = await scores_req
            scores_res.raise_for_status()
            score_records = scores_res.json()

            actual_month = month
            actual_year = year
            actual_month_name = month_name

            from calendar import monthrange
            last_day = monthrange(actual_year, actual_month)[1]
            start_date_str = f"{actual_year}-{actual_month:02d}-01"
            end_date_str = f"{actual_year}-{actual_month:02d}-{last_day:02d}"

            # Fetch monthly attendance for overriding strictly
            att_req = fetch_all_records(client,
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,hours&date=gte.{start_date_str}&date=lte.{end_date_str}"
            )
            monthly_att_records = await att_req

            monthly_hours_map = {}
            for rec in monthly_att_records:
                en = str(rec.get("enrollment_no", "")).strip().upper()
                hours = float(rec.get("hours") or 0)
                if en:
                    monthly_hours_map[en] = monthly_hours_map.get(en, 0) + hours

        monthly_score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            points = rec.get("points", 0) or 0
            monthly_score_map[en] = monthly_score_map.get(en, 0) + points

        for en, student in stats_map.items():
            student["_sort_monthly_score"] = monthly_score_map.get(en, 0)
            student["_sort_monthly_hours"] = monthly_hours_map.get(en, 0)
            # Extract numeric attendance for tiebreaking (e.g. "40%" -> 40)
            att_str = student.get("attendance_percentage", "0%")
            try:
                student["_sort_attendance"] = float(att_str.replace("%", ""))
            except (ValueError, AttributeError):
                student["_sort_attendance"] = 0

        students = list(stats_map.values())
        # Multi-level sort: score DESC -> attendance DESC -> hours DESC
        students.sort(key=lambda s: (
            s.get("_sort_monthly_score", 0),
            s.get("_sort_attendance", 0),
            s.get("_sort_monthly_hours", 0),
        ), reverse=True)

        for idx, student in enumerate(students):
            student["rank"] = idx + 1
            
            # OVERRIDE total_hours for the endpoint
            mh = monthly_hours_map.get(student["enrollment_no"], 0)
            student["total_hours"] = f"{round(mh, 1):.1f} Hrs" if mh > 0 else "0 Hrs"
            
            # OVERRIDE total_score for the endpoint
            ms = monthly_score_map.get(student["enrollment_no"], 0)
            student["total_score"] = int(ms)
            
            student.pop("_raw_score", None)
            student.pop("_raw_hours", None)
            student.pop("_sort_monthly_score", None)
            student.pop("_sort_monthly_hours", None)
            student.pop("_sort_attendance", None)

        return {
            "leaderboard": students,
            "month": actual_month,
            "year": actual_year,
            "monthName": actual_month_name,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
