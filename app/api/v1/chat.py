from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/")
async def chat(user_message):
    return { "user": user_message}