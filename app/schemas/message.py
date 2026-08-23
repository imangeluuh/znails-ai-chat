from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str

class MessageCreate(MessageBase):
    model: Optional[str] = None

class MessageRead(MessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    model: Optional[str] = None
    created_at: datetime

