import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")

@router.get("/timeline")
async def get_timeline():
    """
    Proxy endpoint to fetch timeline_entries from Supabase.
    This bypasses local network DNS blocks (like campus Wi-Fi) 
    that prevent the React frontend from reaching Supabase directly.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/timeline_entries?select=*&is_active=eq.true&order=display_order.asc",
                headers=HEADERS
            )
            res.raise_for_status()
            return {"data": res.json()}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Supabase Error: {exc.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
