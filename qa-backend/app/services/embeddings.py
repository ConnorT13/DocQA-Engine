from functools import lru_cache
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List

@lru_cache(maxsize=1)
def _model():
    return SentenceTransformer("all-MiniLM-L6-v2")

def embed_texts(texts: List[str]) -> np.ndarray:
    """returns L2 normalized embeddings of the texts"""
    embs = _model().encode(
        texts, batch_size=32, 
        show_progress_bar=False, 
        normalize_embeddings=True
    )
    return np.asarray(embs, dtype=np.float32)

def embed_query(text: str) -> np.ndarray:
    return _model().encode([text])[0]

