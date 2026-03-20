import httpx
import json
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


def parse_array_field(val):
    """Parse a value that might be a JSON array string, a list, or a comma-separated string."""
    if not val or val == "-":
        return []
    if isinstance(val, list):
        return [v for v in val if v and v != "-"]
    if isinstance(val, str):
        trimmed = val.strip()
        if trimmed in ("[]", "", "-"):
            return []
        try:
            parsed = json.loads(trimmed)
            if isinstance(parsed, list):
                return [v for v in parsed if v and v != "-"]
        except (json.JSONDecodeError, ValueError):
            pass
        # Comma-separated fallback
        return [s.strip() for s in trimmed.split(",") if s.strip() and s.strip() != "-"]
    return []


@router.get("/member-metrics/{enrollment_no}")
async def get_member_metrics(enrollment_no: str):
    """
    Fetch research areas, hackathons, research papers, patents, projects,
    and achievements from member_cv_profiles for a specific member.
    Returns parsed arrays and counts for the researcher modal card.
    """
    try:
        lookup = enrollment_no.strip().upper()

        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/member_cv_profiles"
                f"?enrollment_no=eq.{lookup}"
                f"&select=research_area,research_papers,hackathons,patents,projects",
                headers=HEADERS,
            )
            res.raise_for_status()
            rows = res.json()

        if not rows:
            return {
                "research_areas": [],
                "research_papers": [],
                "hackathons": [],
                "patents": [],
                "projects": [],
            }

        profile = rows[0]

        # Parse research_area (comma-separated string)
        research_areas = []
        ra_val = profile.get("research_area")
        if ra_val and ra_val != "-":
            if isinstance(ra_val, str):
                research_areas = [s.strip() for s in ra_val.split(",") if s.strip() and s.strip() != "-"]

        return {
            "research_areas": research_areas,
            "research_papers": parse_array_field(profile.get("research_papers")),
            "hackathons": parse_array_field(profile.get("hackathons")),
            "patents": parse_array_field(profile.get("patents")),
            "projects": parse_array_field(profile.get("projects")),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
