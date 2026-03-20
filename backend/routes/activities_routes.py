import httpx
from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, HEADERS
import asyncio

router = APIRouter(prefix="/api")

@router.get("/activities")
async def get_activities():
    """
    Proxy endpoint to fetch activities from Supabase and generate signed URLs for images.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/activities?select=*",
                headers=HEADERS
            )
            res.raise_for_status()
            activities = res.json()

            # For each activity, if Photo exists, generate signed URL
            async def attach_signed_url(act):
                if act.get("Photo"):
                    try:
                        # Request a signed URL from Supabase Storage REST API
                        # POST /storage/v1/object/sign/[bucket]/[key]
                        sign_res = await client.post(
                            f"{SUPABASE_URL}/storage/v1/object/sign/Activity_images/{act['Photo']}",
                            headers=HEADERS,
                            json={"expiresIn": 3600}
                        )
                        if sign_res.status_code == 200:
                            signed_data = sign_res.json()
                            if "signedURL" in signed_data:
                                # signedURL is typically returned as a relative path e.g. "/storage/v1/object/sign/bucket/path?token=XYZ"
                                act["signedPhotoUrl"] = SUPABASE_URL + signed_data["signedURL"]
                    except Exception as e:
                        print(f"Failed to sign URL for {act['Photo']}: {e}")
                return act

            # Concurrent requests to sign URLs
            activities_with_urls = await asyncio.gather(*(attach_signed_url(act) for act in activities))
            
            return {"data": activities_with_urls}
            
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Supabase Error: {exc.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
