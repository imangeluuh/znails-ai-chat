from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional
from app.database.models import Category

class ServiceBase(BaseModel):
    name: str
    category: Category
    description: Optional[str] = None
    duration: int
    price: Decimal

class ServiceCreate(ServiceBase):
    pass

class ServiceRead(ServiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime