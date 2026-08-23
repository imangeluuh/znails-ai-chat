from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from fastapi import HTTPException
from app.config import GEMINI_API_KEY, LLM_MODEL


# Initialize the chat model
llm = init_chat_model(
    LLM_MODEL,
    api_key=GEMINI_API_KEY,
    )

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful AI assistant for Z Nails, a nail salon. Answer customer questions politely and concisely."),
        ("human", "Question: {question}")
    ]
)

chain = prompt | llm | StrOutputParser()

def get_ai_response(user_message: str) -> str:
    try:
        return chain.invoke({"question": user_message})
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service is temporarily unavailable. Please try again.")