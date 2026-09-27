from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.chat import router
from app.database.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Z Nails")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)