import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()  # reads .env file into environment variables

PDF_DIR = Path(__file__).parents[1] / "docs"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./znails.db")
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-3.6-flash")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "models/gemini-embedding-001")
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set. Add it to your .env file.")