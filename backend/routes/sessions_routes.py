import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


@router.get("/srl_sessions")
async def get_all_srl_sessions():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
