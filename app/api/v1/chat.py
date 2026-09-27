from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import LLM_MODEL
from app.database.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.chains.rag_chain import get_rag_response, build_chat_history
from app.repositories import chat_repository
from app.rate_limiter import rate_limiter

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post(
    "/", 
    response_model=ChatResponse,
    dependencies=[Depends(rate_limiter(max_requests=10, window_seconds=60))]
)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    conv = chat_repository.get_or_create_conversation(db, request.session_id)

    # IMPORTANT: fetch history BEFORE adding the new user message, otherwise
    # the current question would appear twice -- once as history, once as
    # the active question being asked.
    db_history = chat_repository.get_history(db, conv.id)
    chat_history = build_chat_history(db_history)

    chat_repository.add_message(db, conv.id, role="user", content=request.message)

    ai_response = get_rag_response(request.message, chat_history=chat_history)

    chat_repository.add_message(db, conv.id, role="assistant", content=ai_response, model=LLM_MODEL)

    return ChatResponse(response=ai_response)