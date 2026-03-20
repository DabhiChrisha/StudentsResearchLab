import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")

class JoinUsForm(BaseModel):
    name: str
    enrollment: str
    semester: str
    division: str
    branch: str
    college: str
    contact: str
    email: str
    batch: str
    source: str
    reference_name: Optional[str] = ""

@router.post("/join-us")
async def submit_join_us(form: JoinUsForm):
    """
    Proxy endpoint to submit join_us applications securely to Supabase, 
    bypassing frontend DNS restrictions.
    """
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Merging existing auth headers and requesting PostgREST to return the inserted row
            post_headers = {**HEADERS, "Prefer": "return=representation"}
            res = await client.post(
                f"{SUPABASE_URL}/rest/v1/join_us",
                headers=post_headers,
                json=[form.dict()]
            )
            
            if res.status_code >= 400:
                # If Supabase complains (like 'unique_enrollment'), we forward the exact text 
                # to the frontend so the same exact alerts show up!
                raise HTTPException(status_code=res.status_code, detail=res.json())
            
            return {"data": res.json()}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
