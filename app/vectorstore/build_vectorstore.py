import logging
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.vectorstore.extract_and_chunk import build_documents_from_pdfs
from app.config import GOOGLE_API_KEY, EMBEDDING_MODEL, CHROMA_PERSIST_DIR



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_vectorstore() -> Chroma:
    documents = build_documents_from_pdfs()

    if not documents:
        raise RuntimeError(
            "No documents were extracted from the PDFs. "
            "Check that PDF_DIR in extract_and_chunk.py points to the correct folder "
            "and that it actually contains .pdf files."
        )

    embedding = GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        api_key=GOOGLE_API_KEY
    )

    vectorstore = Chroma.from_documents(
        collection_name="znails_knowledge_base",
        documents=documents,
        embedding=embedding,
        persist_directory=CHROMA_PERSIST_DIR
    )

    logger.info("Persisted %d vectors to %s", len(documents), CHROMA_PERSIST_DIR)

    return vectorstore


if __name__ == "__main__":
    vectorstore = build_vectorstore()

    # Quick sanity check: run one similarity search to confirm retrieval works
    test_query = "How much does a gel manicure cost?"
    results = vectorstore.similarity_search(test_query, k=2)

    print(f"\nTest query: '{test_query}'")
    print(f"Top {len(results)} results:\n")
    for i, doc in enumerate(results, 1):
        print(f"{i}. [{doc.metadata['source']} chunk #{doc.metadata['chunk_index']}]")
        print(f"   {doc.page_content[:150]}...\n")