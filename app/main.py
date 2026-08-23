from fastapi import FastAPI
from app.api.v1.chat import router
from app.database.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Z Nails")

app.include_router(router)