import logging
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.vectorstore.extract_and_chunk import build_documents_from_pdfs
from app.config import GOOGLE_API_KEY, EMBEDDING_MODEL, CHROMA_PERSIST_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

COLLECTION_NAME = "znails_knowledge_base"


def _get_embedding() -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=GOOGLE_API_KEY,
        max_retries=3,
    )

def build_vectorstore() -> Chroma:
    """Re-extract all PDFs, re-embed them, and overwrite the persisted store."""
    documents = build_documents_from_pdfs()

    if not documents:
        raise RuntimeError(
            "No documents were extracted from the PDFs. "
            "Check that PDF_DIR in extract_and_chunk.py points to the correct folder "
            "and that it actually contains .pdf files."
        )

    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=_get_embedding(),
        collection_name=COLLECTION_NAME,
        persist_directory=CHROMA_PERSIST_DIR
    )

    logger.info("Persisted %d vectors to %s", len(documents), CHROMA_PERSIST_DIR)

    return vectorstore

def load_vectorstore() -> Chroma:
    """Connect to the existing persisted store without re-embedding"""
    return Chroma(
        embedding_function=_get_embedding(),
        collection_name=COLLECTION_NAME,
        persist_directory=CHROMA_PERSIST_DIR
    )

if __name__ == "__main__":
    # running this file directly = explicit rebuild
    vectorstore = build_vectorstore()
 
    test_query = "How much does a gel manicure cost?"
    results = vectorstore.similarity_search(test_query, k=2)
    print(f"\nTest query: '{test_query}'")
    for i, doc in enumerate(results, 1):
        print(f"{i}. [{doc.metadata['source']} #{doc.metadata['chunk_index']}] {doc.page_content[:150]}...")