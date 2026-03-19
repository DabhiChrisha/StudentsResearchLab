import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS

router = APIRouter(prefix="/api")


@router.get("/papers/{student_name}")
async def get_member_papers(student_name: str):
    """
    Fetch all research paper titles for a specific member.
    Uses PostgREST embedded resources to JOIN paper_authors → research_papers
    in a single query, filtered by author_name.
    Consistently derives metrics from this single source of truth.
    """
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/paper_authors"
                f"?author_name=eq.{student_name}"
                f"&select=research_papers(id,title)",
                headers=HEADERS,
            )
            res.raise_for_status()
            rows = res.json()

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

        paper_count = len(papers)

        return {
            "research_areas": [],
            "research_works_count": paper_count,
            "hackathons_count": 0,
            "papers_published_count": paper_count,
            "hackathons": [],
            "papers": papers
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
