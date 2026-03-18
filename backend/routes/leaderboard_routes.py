import asyncio
from datetime import datetime

import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

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
    Overall leaderboard endpoint.
    - Fetches debate_scores (per-month rows) and SUMs points per student.
    - Fetches attendance and computes SRL attendance %, total hours dedicated.
    - Fetches student names from students_details.
    - Ranks by total points descending.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch all data sources in parallel
            scores_req = client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points",
                headers=HEADERS
            )
            att_req = client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
                headers=HEADERS
            )
            srl_req = client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            details_req = client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=*",
                headers=HEADERS
            )

            scores_res, att_res, srl_res, details_res = await asyncio.gather(
                scores_req, att_req, srl_req, details_req
            )

            scores_res.raise_for_status()
            att_res.raise_for_status()
            srl_res.raise_for_status()
            details_res.raise_for_status()

            score_records = scores_res.json()
            attendance_records = att_res.json()
            srl_records = srl_res.json()
            detail_records = details_res.json()

        # --- Build lookup maps ---

        # Score map: GROUP BY enrollment_no, SUM(points)
        score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            points = rec.get("points", 0) or 0
            score_map[en] = score_map.get(en, 0) + points

        # Name and Image map from students_details
        name_map = {}
        image_map = {}
        info_map = {}
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]
            if rec.get("profile_image"):
                image_map[en] = rec["profile_image"]
            
            info_map[en] = {
                "dept": rec.get("department") or rec.get("dept") or "CE",
                "semester": rec.get("semester") or rec.get("sem") or "6th",
                "div": rec.get("division") or rec.get("div") or "-",
                "batch": rec.get("batch") or "2023-2027",
            }

        # Attendance map: { "ENROLLMENT_NO": { date: total_hours } }
        attendance_map = {}
        for rec in attendance_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            date = rec.get("date")
            hours = float(rec.get("hours") or 0)
            if en and date:
                if en not in attendance_map:
                    attendance_map[en] = {}
                attendance_map[en][date] = attendance_map[en].get(date, 0) + hours

        # SRL session dates set
        srl_dates = {r.get("session_date") for r in srl_records if r.get("session_date")}

        # --- Compute total distinct recorded days in attendance globally ---
        distinct_attendance_dates = {rec.get("date") for rec in attendance_records if rec.get("date")}
        total_recorded_days = len(distinct_attendance_dates)

        # Build prefix strictly for current calendar month
        now = datetime.now()
        current_month_prefix = f"{now.year:04d}-{now.month:02d}"

        # --- Compute per-student metrics ---
        all_enrollments = set(score_map.keys()) | set(name_map.keys()) | set(attendance_map.keys())

        students = []
        for en in all_enrollments:
            total_points = score_map.get(en, 0)
            name = name_map.get(en, "Unknown Student")

            # Attendance and SRL metrics
            attendance_pct = 0
            srl_pct = 0
            total_hours = 0

            daily = attendance_map.get(en, {})
            if daily:
                # All-time dedicated hours
                total_hours = round(sum(daily.values()), 2)
                
                # Attendance Percentage
                present_days = sum(1 for h in daily.values() if h > 0)
                if total_recorded_days > 0:
                    attendance_pct = round((present_days / total_recorded_days) * 100)

                srl_valid = {d: h for d, h in daily.items() if d in srl_dates}
                total_srl = len(srl_valid)
                if total_srl > 0:
                    present_srl = sum(1 for h in srl_valid.values() if h > 0)
                    srl_pct = round((present_srl / total_srl) * 100)

            info = info_map.get(en, {})
            students.append({
                "enrollment_no": en,
                "name": name,
                "image": image_map.get(en, None),
                "score": total_points,
                "attendance": attendance_pct,
                "srlAttendance": srl_pct,
                "totalHours": total_hours,
                "dept": info.get("dept", "CE"),
                "semester": info.get("semester", "6th"),
                "div": info.get("div", "-"),
                "batch": info.get("batch", "2023-2027"),
            })

        # Sort by total points desc, then attendance desc
        students.sort(key=lambda s: (-s["score"], -s["attendance"]))

        # Assign ranks (sequential)
        for idx, student in enumerate(students):
            student["rank"] = idx + 1

        return {"leaderboard": students}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leaderboard/top-hours")
async def get_top_hours_leaderboard():
    """
    Returns exactly the top 5 students by hours dedicated in February 2026.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch attendance strictly between 2026-02-01 and 2026-02-28
            att_req = client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours&date=gte.2026-02-01&date=lte.2026-02-28",
                headers=HEADERS
            )
            details_req = client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=*",
                headers=HEADERS
            )
            att_res, details_res = await asyncio.gather(att_req, details_req)
            att_res.raise_for_status()
            details_res.raise_for_status()

            attendance_records = att_res.json()
            detail_records = details_res.json()

        # Build name & image maps
        name_map = {}
        image_map = {}
        info_map = {}
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]
            if rec.get("profile_image"):
                image_map[en] = rec["profile_image"]
            
            info_map[en] = {
                "dept": rec.get("department") or rec.get("dept") or "CE",
                "semester": rec.get("semester") or rec.get("sem") or "6th",
                "div": rec.get("division") or rec.get("div") or "-",
                "batch": rec.get("batch") or "2023-2027",
            }

        # Aggregate hours for the month
        monthly_hours_map = {}
        for rec in attendance_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            hours = float(rec.get("hours") or 0)
            if en:
                monthly_hours_map[en] = monthly_hours_map.get(en, 0) + hours

        # Build result list
        students = []
        for en, total_hrs in monthly_hours_map.items():
            info = info_map.get(en, {})
            students.append({
                "enrollment_no": en,
                "name": name_map.get(en, "Unknown Student"),
                "image": image_map.get(en, None),
                "totalHours": round(total_hrs, 2),
                # Safe defaults for podium usage
                "score": 0, "attendance": 0, "srlAttendance": 0,
                "dept": info.get("dept", "CE"),
                "semester": info.get("semester", "6th"),
                "div": info.get("div", "-"),
                "batch": info.get("batch", "2023-2027"),
            })

        # Sort by totalHours DESC
        students.sort(key=lambda s: s["totalHours"], reverse=True)

        # Assign ranks
        for idx, student in enumerate(students):
            student["rank"] = idx + 1

        return {"leaderboard": students}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard/monthly")
async def get_monthly_leaderboard(year: int = None, month: int = None):
    """
    Monthly leaderboard endpoint.
    Fetches debate_scores filtered by month and year.
    If no data for the requested month, falls back to the previous month.
    """
    now = datetime.now()
    if year is None:
        year = now.year
    if month is None:
        month = now.month

    month_name = MONTH_NAMES[month - 1]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch debate_scores for the requested month
            scores_req = client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points"
                f"&month=eq.{month_name}&year=eq.{year}",
                headers=HEADERS
            )
            # Fetch attendance filtered strictly to this month
            current_date_prefix = f"{year:04d}-{month:02d}"
            att_req = client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
                headers=HEADERS
            )
            srl_req = client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            details_req = client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=*",
                headers=HEADERS
            )

            scores_res, att_res, srl_res, details_res = await asyncio.gather(
                scores_req, att_req, srl_req, details_req
            )

            scores_res.raise_for_status()
            att_res.raise_for_status()
            srl_res.raise_for_status()
            details_res.raise_for_status()

            score_records = scores_res.json()
            attendance_records = att_res.json()
            srl_records = srl_res.json()
            detail_records = details_res.json()

        # If no scores or all scores are zero for this month, try the previous month
        actual_month = month
        actual_year = year
        actual_month_name = month_name
        has_real_scores = any((rec.get("points") or 0) > 0 for rec in score_records)
        if not score_records or not has_real_scores:
            prev_month = month - 1 if month > 1 else 12
            prev_year = year if month > 1 else year - 1
            prev_month_name = MONTH_NAMES[prev_month - 1]
            async with httpx.AsyncClient(timeout=30.0) as client:
                fallback_res = await client.get(
                    f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points"
                    f"&month=eq.{prev_month_name}&year=eq.{prev_year}",
                    headers=HEADERS
                )
                fallback_res.raise_for_status()
                score_records = fallback_res.json()
                actual_month = prev_month
                actual_year = prev_year
                actual_month_name = prev_month_name
                # Note: We purposely do NOT update current_date_prefix here 
                # because attendance hours should ALWAYS strictly be current month

        # Score map for the month (each student should have one row per month)
        score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            points = rec.get("points", 0) or 0
            score_map[en] = score_map.get(en, 0) + points

        # Name and Image map
        name_map = {}
        image_map = {}
        info_map = {}
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]
            if rec.get("profile_image"):
                image_map[en] = rec["profile_image"]
            
            info_map[en] = {
                "dept": rec.get("department") or rec.get("dept") or "CE",
                "semester": rec.get("semester") or rec.get("sem") or "6th",
                "div": rec.get("division") or rec.get("div") or "-",
                "batch": rec.get("batch") or "2023-2027",
            }

        # Attendance map filtered exclusively to the current strictly requested month
        attendance_map = {}
        for rec in attendance_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            date = rec.get("date")
            hours = float(rec.get("hours") or 0)
            if en and date and date.startswith(current_date_prefix):
                if en not in attendance_map:
                    attendance_map[en] = {}
                attendance_map[en][date] = attendance_map[en].get(date, 0) + hours

        # SRL session dates filtered to the strictly requested month
        srl_dates = {
            r.get("session_date") for r in srl_records
            if r.get("session_date") and r["session_date"].startswith(current_date_prefix)
        }
        # Compute total distinct recorded days in the MONTH's attendance
        distinct_attendance_dates = {rec.get("date") for rec in attendance_records if rec.get("date") and rec["date"].startswith(current_date_prefix)}
        total_recorded_days = len(distinct_attendance_dates)

        # Compute per-student metrics
        all_enrollments = set(score_map.keys()) | set(name_map.keys()) | set(attendance_map.keys())
        students = []
        for en in all_enrollments:
            points = score_map.get(en, 0)
            name = name_map.get(en, "Unknown Student")

            attendance_pct = 0
            srl_pct = 0
            current_month_hours = 0
            daily = attendance_map.get(en, {})
            if daily:
                current_month_hours = round(sum(daily.values()), 2)
                present_days = sum(1 for h in daily.values() if h > 0)
                if total_recorded_days > 0:
                    attendance_pct = round((present_days / total_recorded_days) * 100)

                srl_valid = {d: h for d, h in daily.items() if d in srl_dates}
                total_srl = len(srl_valid)
                if total_srl > 0:
                    present_srl = sum(1 for h in srl_valid.values() if h > 0)
                    srl_pct = round((present_srl / total_srl) * 100)

            info = info_map.get(en, {})
            students.append({
                "enrollment_no": en,
                "name": name,
                "image": image_map.get(en, None),
                "score": points,
                "attendance": attendance_pct,
                "srlAttendance": srl_pct,
                "totalHours": current_month_hours,
                "dept": info.get("dept", "CE"),
                "semester": info.get("semester", "6th"),
                "div": info.get("div", "-"),
                "batch": info.get("batch", "2023-2027"),
            })

        # Sort by points desc, then attendance desc
        students.sort(key=lambda s: (-s["score"], -s["attendance"]))

        # Assign ranks
        for idx, student in enumerate(students):
            student["rank"] = idx + 1

        return {
            "leaderboard": students,
            "month": actual_month,
            "year": actual_year,
            "monthName": actual_month_name,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
