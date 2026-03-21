import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://students-research-lab-srl.vercel.app")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("CRITICAL ERROR: Supabase credentials not found. Make sure to set SUPABASE_URL and SUPABASE_KEY in environment variables.")

# Allow both production and local development origins
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
    # Wildcard * removed for production security
]

# DNS patch for Supabase (bypasses local DNS blocks)
# We disable this on cloud deployments (like Render) since they have normal DNS and forcing the IP breaks SNI
is_cloud_deployment = os.getenv("RENDER") == "true" or os.getenv("VERCEL") == "1" or os.getenv("PRODUCTION") == "true"

if SUPABASE_URL and not is_cloud_deployment:
    try:
        supabase_host = urlparse(SUPABASE_URL).hostname
        old_getaddrinfo = socket.getaddrinfo
        def new_getaddrinfo(*args, **kwargs):
            if args[0] and supabase_host in str(args[0]):
                return old_getaddrinfo('104.18.38.10', *args[1:], **kwargs)
            return old_getaddrinfo(*args, **kwargs)
        socket.getaddrinfo = new_getaddrinfo
        print(f"Applied DNS patch for {supabase_host} to bypass local DNS blocks")
    except Exception as e:
        print(f"Failed to apply DNS patch: {e}")

# Headers for PostgREST API
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}
