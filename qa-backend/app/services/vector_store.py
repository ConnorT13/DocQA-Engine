import uuid
import chromadb
from typing import List, Dict, Any

from chromadb.api.types import D

class VectorStore:
    def __init__(self, collection_name: str = "documents"):
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name=collection_name)

    
    def add_chunks(self, chunks: List[str], file_info: Dict[str, Any]):
        if not chunks:
            return
        
        chunk_ids = [str(uuid.uuid4()) for _ in chunks]

        metadatas = [
            {
                "file_name": file_info.get("original_filename"),
                "file_path": file_info.get("saved_to"),
                "chunk_index": i
            }
            for i in range(len(chunks))
        ]

        self.collection.add(
            documents=chunks,
            ids=chunk_ids,
            metadatas=metadatas
        )
    
    def search(self, query: str, k: int = 5) -> List[Dict]:
        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        documents = results['documents'][0]
        metadatas = results['metadatas'][0]
        distances = results['distances'][0]

        formatted_results = []

        for i, doc in enumerate(documents):
            formatted_results.append({
                'chunk': doc,
                'metadata': metadatas[i],
                'distance': distances[i]
            })

        return formatted_results
        