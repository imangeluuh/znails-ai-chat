from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import LLM_MODEL
from app.database.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.chains.chat_chain import get_ai_response
from app.repositories import chat_repository

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    conv = chat_repository.get_or_create_conversation(db, request.session_id)
    chat_repository.add_message(db, conv.id, role="user", content=request.message)

    ai_response = get_ai_response(request.message)

    chat_repository.add_message(db, conv.id, role="assistant", content=ai_response, model=LLM_MODEL)

    return ChatResponse(response=ai_response)