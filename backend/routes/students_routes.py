import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


@router.get("/students")
async def get_students():
    """
    Returns a list of all students with aggregated total points.
    Debate_scores has per-month rows, so we SUM points per enrollment_no.
    """
    try:
        async with httpx.AsyncClient() as client:
            scores_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,points",
                headers=HEADERS
            )
            scores_res.raise_for_status()

            details_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=enrollment_no,student_name",
                headers=HEADERS
            )
            details_res.raise_for_status()

            scores = scores_res.json()
            details = details_res.json()

            # Build name map from students_details
            name_map = {}
            for rec in details:
                en = str(rec.get("enrollment_no", "")).strip().upper()
                if rec.get("student_name"):
                    name_map[en] = rec["student_name"]

            # Aggregate points per student
            points_map = {}
            for sc in scores:
                en = str(sc.get("enrollment_no", "")).strip().upper()
                points = sc.get("points", 0) or 0
                points_map[en] = points_map.get(en, 0) + points

            result = []
            for en, total in points_map.items():
                result.append({
                    "id": en,
                    "enrollment_no": en,
                    "name": name_map.get(en, "Unknown Student"),
                    "attendance_percentage": 0.0,
                    "total_score": total
                })

            return {"students": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
