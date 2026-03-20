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
        return [s.strip() for s in trimmed.split(",") if s.strip() and s.strip() != "-"]
    return []


@router.get("/batch-member-stats")
async def get_batch_member_stats():
    """
    Fetch stats for ALL members in a single batch call.
    Returns a map keyed by student_name with research_works_count,
    hackathons_count, and papers_published_count.
    Used by the ChromaGrid cards to display real Supabase data.
    """
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            # 1) Fetch ALL paper_authors with joined research_papers
            papers_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/paper_authors"
                f"?select=author_name,research_papers(id,title)",
                headers=HEADERS,
            )
            papers_res.raise_for_status()
            paper_rows = papers_res.json()

            # 2) Fetch ALL member_cv_profiles for hackathons
            profiles_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/member_cv_profiles"
                f"?select=enrollment_no,hackathons",
                headers=HEADERS,
            )
            profiles_res.raise_for_status()
            profile_rows = profiles_res.json()

        # Build papers count per author_name
        # author_name → set of unique paper IDs
        author_papers = {}
        for row in paper_rows:
            author = row.get("author_name", "").strip()
            if not author:
                continue
            paper = row.get("research_papers")
            if paper and isinstance(paper, dict):
                pid = paper.get("id")
                title = paper.get("title")
                if pid and title and title.strip():
                    if author not in author_papers:
                        author_papers[author] = set()
                    author_papers[author].add(pid)

        # Build hackathons count per enrollment_no
        enrollment_hackathons = {}
        for profile in profile_rows:
            enroll = (profile.get("enrollment_no") or "").strip().upper()
            if not enroll:
                continue
            hacks = parse_array_field(profile.get("hackathons"))
            enrollment_hackathons[enroll] = len(hacks)

        # Build the result: keyed by author_name
        stats_by_name = {}
        for name, paper_ids in author_papers.items():
            count = len(paper_ids)
            stats_by_name[name] = {
                "research_works_count": count,
                "papers_published_count": count,
            }

        return {
            "stats_by_name": stats_by_name,
            "hackathons_by_enrollment": enrollment_hackathons,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
