import logging
from pathlib import Path
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import PDF_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CHUNK_SIZE = 400
CHUNK_OVERLAP = 50

def extract_pdf_text(path: Path) -> str:
    loader = PyPDFLoader(str(path))
    # join pages with a space (not newline) to avoid odd mid-sentence breaks
    # that PDF page boundaries can introduce
    text = " ".join([page.page_content for page in loader.load()])
    # collapse repeated whitespace left over from PDF line wraps
    text = " ".join(text.split())
    return text

def build_documents_from_pdfs() -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len
    )

    documents = []

    for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
        text = extract_pdf_text(pdf_path)
        chunks = splitter.split_text(text)
 
        for i, chunk in enumerate(chunks):
            documents.append(
                Document(
                    page_content=chunk,
                    metadata={"source": pdf_path.name, "chunk_index": i},
                )
            )
        logger.info("%s -> %d chunks", pdf_path.name, len(chunks))
 
    return documents

if __name__ == "__main__":
    docs = build_documents_from_pdfs()
    print(f"\nTotal chunks: {len(docs)}")
    for d in docs:
        print(f"  [{d.metadata['source']} #{d.metadata['chunk_index']}] "
              f"({len(d.page_content)} chars) {d.page_content}...")