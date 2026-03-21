import json
import httpx
from fastapi import APIRouter, HTTPException, Query
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


def parse_array_field(val):
    """Parse a value that might be a JSON array string, a list, or a comma-separated string."""
    if not val or val == "-":
        return []
    if isinstance(val, list):
        return [v for v in val if v is not None and str(v) != "-"]
    if isinstance(val, str):
        trimmed = val.strip()
        if trimmed in ("[]", "", "-"):
            return []
        try:
            parsed = json.loads(trimmed)
            if isinstance(parsed, list):
                return [v for v in parsed if v is not None and str(v) != "-"]
        except (json.JSONDecodeError, ValueError):
            pass
        return [s.strip() for s in trimmed.split(",") if s.strip() and s.strip() != "-"]
    return []


@router.get("/papers/{student_name}")
async def get_member_papers(student_name: str, enrollment_no: str = Query("")):
    """
    Fetch all research paper titles for a specific member.
    Uses PostgREST embedded resources to JOIN paper_authors → research_papers
    in a single query, filtered by author_name.

    When enrollment_no is provided, also fetches hackathons, research areas,
    and other metrics from member_cv_profiles so the researcher card can
    display accurate stats instead of hardcoded zeros.
    """
    try:
        research_areas = []
        hackathons = []
        hackathons_count = 0
        patents = []
        projects = []

        async with httpx.AsyncClient(timeout=15.0) as client:
            # 1) Fetch published papers via paper_authors → research_papers
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/paper_authors",
                params={
                    "author_name": f"eq.{student_name}",
                    "select": "research_papers(id,title)"
                },
                headers=HEADERS,
            )
            res.raise_for_status()
            rows = res.json()

            # 2) If enrollment_no provided, also fetch profile metrics
            if enrollment_no.strip():
                lookup = enrollment_no.strip().upper()
                profile_res = await client.get(
                    f"{SUPABASE_URL}/rest/v1/member_cv_profiles",
                    params={
                        "enrollment_no": f"eq.{lookup}",
                        "select": "research_area,hackathons,research_papers,patents,projects"
                    },
                    headers=HEADERS,
                )
                profile_res.raise_for_status()
                profile_rows = profile_res.json()

                if profile_rows:
                    profile = profile_rows[0]
                    # Parse research_area (comma-separated string)
                    ra_val = profile.get("research_area")
                    if ra_val and ra_val != "-":
                        if isinstance(ra_val, str):
                            research_areas = [
                                s.strip() for s in ra_val.split(",")
                                if s.strip() and s.strip() != "-"
                            ]

                    hackathons = parse_array_field(profile.get("hackathons"))
                    hackathons_count = len(hackathons)

                    # Also Parse patents and projects to sum into research_works_count
                    patents = parse_array_field(profile.get("patents"))
                    projects = parse_array_field(profile.get("projects"))
                    # If research_papers column in profile is a number/list, count it too
                    profile_papers = parse_array_field(profile.get("research_papers"))
                    
                    # We add these to the core paper_authors count later

        # Extract unique, non-null papers
        seen_ids = set()
        papers = []
        for row in rows:
            paper = row.get("research_papers")
            if paper and isinstance(paper, dict):
                pid = paper.get("id")
                title = paper.get("title")
                if pid and title and title.strip() and pid not in seen_ids:
                    seen_ids.add(pid)
                    papers.append(title.strip())

        papers_published_count = len(papers)
        
        # Aggregate count: papers from authors join + patents + projects (if profile exists)
        # Note: we avoid double counting if papers are in both, but typically they are distinct metrics
        total_research_works = papers_published_count + len(patents) + len(projects)

        return {
            "research_areas": research_areas,
            "research_works_count": total_research_works,
            "hackathons_count": hackathons_count,
            "papers_published_count": papers_published_count,
            "hackathons": hackathons,
            "papers": papers
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
