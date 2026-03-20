import asyncio
import httpx
from config import SUPABASE_URL, HEADERS

async def test_supabase():
    print(f"Testing connectivity to: {SUPABASE_URL}")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/activities?select=count",
                headers=HEADERS
            )
            print(f"Status: {res.status_code}")
            print(f"Response: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_supabase())
