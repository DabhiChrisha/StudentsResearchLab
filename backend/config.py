import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

# ── Environment ──────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# ── CORS ─────────────────────────────────────────────────────
# Hardcoded production URL is the safety net.
# Even if FRONTEND_URL env variable is missing on Render,
# the Vercel URL is always present in this list.
ALLOWED_ORIGINS = list(set(filter(None, [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://students-research-lab-srl.vercel.app",  # ← HARDCODED. NEVER REMOVE.
    FRONTEND_URL,  # ← also pulled from Render env variable
])))

print(f"✅ CORS ALLOWED ORIGINS: {ALLOWED_ORIGINS}")

# ── Cloud Detection ───────────────────────────────────────────
is_cloud_deployment = bool(
    os.environ.get("RENDER") or
    os.environ.get("RENDER_SERVICE_ID") or
    os.environ.get("RENDER_EXTERNAL_URL")
)

# ── DNS Bypass (Local Only) ───────────────────────────────────
if not is_cloud_deployment:
    import socket
    _original_getaddrinfo = socket.getaddrinfo
    def _patched_getaddrinfo(host, port, *args, **kwargs):
        if host and "supabase.co" in str(host):
            return _original_getaddrinfo("104.18.38.10", port, *args, **kwargs)
        return _original_getaddrinfo(host, port, *args, **kwargs)
    socket.getaddrinfo = _patched_getaddrinfo
    print("🔧 DNS patch applied — local dev mode")
else:
    print("☁️ Render detected — DNS patch DISABLED")

# Headers for PostgREST API
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}
