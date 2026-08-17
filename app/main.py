from fastapi import FastAPI
from app.api.v1.chat import router

app = FastAPI(title="Z Nails")

app.include_router(router)