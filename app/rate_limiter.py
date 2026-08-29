import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException

# Maps client IP -> deque of timestamps (seconds) of recent requests
_request_log: dict[str, deque] = defaultdict(deque)


def rate_limiter(max_requests: int = 10, window_seconds: int = 60):
    """Returns a FastAPI dependency that rate-limits by client IP.
    
    Usage:
        @router.post("/", dependencies=[Depends(rate_limiter(max_requests=10, window_seconds=60))])
    """

    def check_rate_limit(request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        log = _request_log[client_ip]

        # drop timestamps older than the window
        while log and now - log[0] > window_seconds:
            log.popleft()

        if len(log) >= max_requests:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please slow down and try again shortly.",
            )

        log.append(now)

    return check_rate_limit