import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file into environment variables

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./znails.db")
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-3.6-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Add it to your .env file.")