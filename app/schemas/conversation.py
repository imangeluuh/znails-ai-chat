from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from app.schemas.message import MessageRead

class ConversationBase(BaseModel):
    session_id: str
    customer_id: Optional[int] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationRead(ConversationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageRead] = []