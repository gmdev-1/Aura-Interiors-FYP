from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_pinecone import PineconeVectorStore
# from langchain_community.llms import HuggingFaceHub
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

load_dotenv()
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def initialize_rag_chain():
    # Load Hugging Face embedding model
    
    # Connect to Pinecone index
    vectorstore = PineconeVectorStore(
        index_name="rag-chatbot",
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY"),  # Explicitly pass API key
    )
    
    # Initialize LLM (Hugging Face)
    llm = HuggingFaceEndpoint(
        repo_id="google/flan-t5-small",
         huggingfacehub_api_token=os.getenv("HUGGINGFACE_ACCESS_TOKEN"),
        temperature=0,          
        max_new_tokens=100 
    )
    
    # Create RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    return qa_chain

rag_chain = initialize_rag_chain()