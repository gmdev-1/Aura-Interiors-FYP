from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_pinecone import PineconeVectorStore
# from langchain_community.llms import HuggingFaceHub
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

load_dotenv()
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
_rag_chain = None

def initialize_rag_chain():
    # Load Hugging Face embedding model
    
    # Connect to Pinecone index
    vectorstore = PineconeVectorStore(
        index_name="rag-chatbot",
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY"),
        # pinecone_environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    
    # Initialize LLM (Hugging Face)
    llm = HuggingFaceEndpoint(
        repo_id="HuggingFaceH4/zephyr-7b-beta",
        task="text-generation",
        huggingfacehub_api_token=os.getenv("HUGGINGFACE_ACCESS_TOKEN"),   
    )
    
    # Create RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    return qa_chain

def get_rag_chain():
    global _rag_chain
    if _rag_chain is None:
        _rag_chain = initialize_rag_chain()
    return _rag_chain