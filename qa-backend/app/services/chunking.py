import re
import nltk
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List
from nltk.tokenize import sent_tokenize

# Download NLTK data only if needed
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    print("Downloading NLTK punkt data...")
    nltk.download('punkt_tab')

print("Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")


def split_into_sentences(text: str) -> List[str]:
    sentences = sent_tokenize(text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]

def chunk_text(sentences: List[str], chunk_size: int = 10, overlap: int = 5) -> List[str]:
    chunks = []
    i = 0
    while i < len(sentences):
        # grab the next window
        window = sentences[i : i + chunk_size]
        chunks.append(" ".join(window))
        # advance by chunk_size - overlap
        i += chunk_size - overlap
    return chunks


def calculate_similarity(sentence1: str, sentence2: str, model) -> float:
    emb1, emb2 = model.encode([sentence1])[0], model.encode([sentence2])[0]
    return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))

    
if __name__ == "__main__":
    test_text = "This is sentence one. This is sentence two! Is this sentence three? ... etc."
    sentences = split_into_sentences(test_text)
    print("Sentences:", sentences)

    chunks = chunk_text(sentences, chunk_size=2, overlap=1)
    print(f"Generated {len(chunks)} chunks:")
    for c in chunks:
        print("-", c)
