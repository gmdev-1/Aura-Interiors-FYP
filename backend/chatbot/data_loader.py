import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from rag_chain import embeddings
import os

def extract_faq_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

here = os.path.dirname(os.path.abspath(__file__))
pdf_file = os.path.join(here, "RAG_Data.pdf")

faq_text = extract_faq_from_pdf(pdf_file)

def load_data_to_pinecone():
    # Split FAQ text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_text(faq_text)
    
    # Upload to Pinecone
    PineconeVectorStore.from_texts(
        texts=texts,
        index_name="rag-chatbot",
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY"),  # Explicitly pass API key
    )

if __name__ == "__main__":
    load_data_to_pinecone()