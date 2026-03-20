import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


@router.get("/cv/{enrollment_no}")
async def get_cv(enrollment_no: str):
    """
    Fetch full CV profile for a student from the member_cv_profiles table.
    Looks up by enrollment_no (case-insensitive).
    """
    try:
        lookup = enrollment_no.strip().upper()

        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/member_cv_profiles"
                f"?enrollment_no=eq.{lookup}"
                f"&select=*",
                headers=HEADERS,
            )
            res.raise_for_status()
            rows = res.json()

        if not rows:
            return {"cv": None}

        profile = rows[0]

        # Replace None values with "-" for clean frontend display
        cleaned = {k: (v if v is not None else "-") for k, v in profile.items()}

        return {"cv": cleaned}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
