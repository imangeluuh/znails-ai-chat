from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.models import Conversation, Message

def get_or_create_conversation(db: Session, session_id: str) -> Conversation:
    stmt = select(Conversation)
    conversation = db.scalars(stmt).first()

    if not conversation:
        conversation = Conversation(session_id=session_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    return conversation

def add_message(db: Session, conversation_id: int, role: str, content: str, model: str | None = None) -> Message:
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        model=model
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message

def get_history(db: Session, session_id: int) -> list[Message]:
    stmt = select(Conversation).where(Conversation.session_id == session_id).order_by(Message.created_at)
    conversation = db.scalars(stmt).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Chat history not found")
    
    return conversation
