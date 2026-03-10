import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


@router.get("/scores")
async def get_all_scores():
    """Fetch all debate_scores records (per-month rows)."""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=*",
                headers=HEADERS
            )
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scores/{student_id}")
async def get_student_scores(student_id: int):
    raise HTTPException(status_code=501, detail="Not Implemented securely for debate_scores yet")
