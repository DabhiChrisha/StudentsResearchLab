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
                f"{SUPABASE_URL}/rest/v1/students_details?select=enrollment_no,student_name",
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

        # Name map from students_details
        name_map = {}
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]

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

        # --- Compute per-student metrics ---
        all_enrollments = set(score_map.keys())

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
                total_hours = round(sum(daily.values()), 2)
                total_days = len(daily)
                present_days = sum(1 for h in daily.values() if h > 0)
                if total_days > 0:
                    attendance_pct = round((present_days / total_days) * 100)

                srl_valid = {d: h for d, h in daily.items() if d in srl_dates}
                total_srl = len(srl_valid)
                if total_srl > 0:
                    present_srl = sum(1 for h in srl_valid.values() if h > 0)
                    srl_pct = round((present_srl / total_srl) * 100)

            students.append({
                "enrollment_no": en,
                "name": name,
                "score": total_points,
                "attendance": attendance_pct,
                "srlAttendance": srl_pct,
                "totalHours": total_hours,
            })

        # Sort by total points desc, then attendance desc
        students.sort(key=lambda s: (-s["score"], -s["attendance"]))

        # Assign ranks (sequential)
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
            # Fetch attendance filtered to this month for hours
            date_prefix = f"{year:04d}-{month:02d}"
            att_req = client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
                headers=HEADERS
            )
            srl_req = client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            details_req = client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=enrollment_no,student_name",
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
                date_prefix = f"{prev_year:04d}-{prev_month:02d}"

        # Score map for the month (each student should have one row per month)
        score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            points = rec.get("points", 0) or 0
            score_map[en] = score_map.get(en, 0) + points

        # Name map
        name_map = {}
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]

        # Attendance map filtered to the target month
        attendance_map = {}
        for rec in attendance_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            date = rec.get("date")
            hours = float(rec.get("hours") or 0)
            if en and date and date.startswith(date_prefix):
                if en not in attendance_map:
                    attendance_map[en] = {}
                attendance_map[en][date] = attendance_map[en].get(date, 0) + hours

        # SRL session dates filtered to the target month
        srl_dates = {
            r.get("session_date") for r in srl_records
            if r.get("session_date") and r["session_date"].startswith(date_prefix)
        }

        # Compute per-student metrics
        all_enrollments = set(score_map.keys())
        students = []
        for en in all_enrollments:
            points = score_map.get(en, 0)
            name = name_map.get(en, "Unknown Student")

            attendance_pct = 0
            srl_pct = 0
            total_hours = 0
            daily = attendance_map.get(en, {})
            if daily:
                total_hours = round(sum(daily.values()), 2)
                total_days = len(daily)
                present_days = sum(1 for h in daily.values() if h > 0)
                if total_days > 0:
                    attendance_pct = round((present_days / total_days) * 100)

                srl_valid = {d: h for d, h in daily.items() if d in srl_dates}
                total_srl = len(srl_valid)
                if total_srl > 0:
                    present_srl = sum(1 for h in srl_valid.values() if h > 0)
                    srl_pct = round((present_srl / total_srl) * 100)

            students.append({
                "enrollment_no": en,
                "name": name,
                "score": points,
                "attendance": attendance_pct,
                "srlAttendance": srl_pct,
                "totalHours": total_hours,
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
