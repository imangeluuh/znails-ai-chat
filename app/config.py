import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file into environment variables

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./znails.db")