import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")

class PublicationForm(BaseModel):
    first_author: str
    co_authors: Optional[str] = ""
    department: str
    institution: str
    title: str
    event_type: str
    is_srl_member: str
    paper_link: Optional[str] = ""
    date: str
    summary: str

@router.post("/submit-publication")
async def submit_publication(form: PublicationForm):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            post_headers = {**HEADERS, "Prefer": "return=representation"}
            res = await client.post(
                f"{SUPABASE_URL}/rest/v1/publications_submissions",
                headers=post_headers,
                json=[form.dict()]
            )
            if res.status_code >= 400:
                raise HTTPException(status_code=res.status_code, detail=res.text)
            return {"data": res.json()}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
