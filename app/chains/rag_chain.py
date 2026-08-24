import logging
from fastapi import HTTPException
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from app.config import LLM_MODEL, GOOGLE_API_KEY
from app.vectorstore.store import load_vectorstore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

llm = init_chat_model(
    model=LLM_MODEL,
    api_key=GOOGLE_API_KEY
)

vectorstore = load_vectorstore()
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

RAG_SYSTEM_PROMPT = """You are a helpful AI assistant for Z Nails, a nail salon.

Answer the customer's question using ONLY the context provided below. Do not use any outside knowledge about nail salons, pricing, or policies in general.

If the context does not contain enough information to answer the question, respond exactly with: "I'm sorry, I don't have that information. Please contact Z Nails directly through our social media channels or phone number for further assistance."

Do not guess prices, or details that are not explicitly stated in the context.

Context:
{context}
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", RAG_SYSTEM_PROMPT),
        ("human", "{question}")
    ]
)

def format_docs(docs) -> str:
    if not docs:
        return "(no relevant content found)"
    return "\n\n---\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

def get_rag_response(user_message: str) -> str:
    try:
        return rag_chain.invoke(user_message)
    except Exception:
        logger.exception("RAG chain failed")
        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again."
        )

if __name__ == "__main__":
    # quick manual sanity check -- an in-scope question and an out-of-scope one
    test_questions = [
        "How much does a gel manicure cost?",
        "What's the capital of France?",  # should trigger the fallback, not general knowledge
    ]
    for q in test_questions:
        print(f"Q: {q}")
        print(f"A: {get_rag_response(q)}\n")