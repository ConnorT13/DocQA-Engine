# DocQA Engine Backend

A FastAPI-based backend service that powers the DocQA Engine's document processing, vector storage, and AI-powered question answering capabilities.

![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector%20DB-purple)
![Mistral](https://img.shields.io/badge/Mistral-7B%20LLM-orange)

## 🏗️ Architecture

```
qa-backend/
├── app/
│   ├── main.py                 # FastAPI application & endpoints
│   ├── config.py              # Configuration settings
│   └── services/              # Core business logic
│       ├── document_processor.py  # File text extraction (PDF, DOCX, TXT)
│       ├── chunking.py           # Text chunking & similarity calculation
│       ├── vector_store.py       # ChromaDB integration & vector operations
│       ├── llm_service.py        # Mistral LLM integration via Ollama
│       └── embeddings.py         # Legacy embedding utilities
├── uploads/                   # Uploaded document storage
├── chroma_db/                # ChromaDB persistent storage
├── uploaded_files.json      # File metadata & tracking
└── requirements.txt         # Python dependencies
```

## 🚀 Core Services

### 📄 Document Processor (`document_processor.py`)
Handles extraction of text content from various file formats:
- **PDF Processing** - Uses PyPDF2 for text extraction
- **DOCX Processing** - Uses python-docx for Word document parsing
- **TXT Processing** - Direct UTF-8/Latin-1 text reading
- **Error Handling** - Graceful fallback and detailed error reporting

```python
extract_text_from_file(file_path: str, file_extension: str) -> str
```

### 🔄 Text Chunking (`chunking.py`)
Intelligent text processing and similarity calculation:
- **Sentence Tokenization** - NLTK-based sentence splitting
- **Overlapping Chunks** - Configurable chunk size (default: 20 sentences, 2 overlap)
- **Similarity Calculation** - Cosine similarity using sentence transformers
- **Preprocessing** - Text cleaning and normalization

```python
split_into_sentences(text: str) -> List[str]
chunk_text(sentences: List[str], chunk_size: int = 20, overlap: int = 2) -> List[str]
calculate_similarity(sentence1: str, sentence2: str) -> float
```

### 🗄️ Vector Store (`vector_store.py`)
ChromaDB integration for semantic search:
- **Persistent Storage** - Local ChromaDB instance with file-based persistence
- **Vector Operations** - Automatic embedding generation and similarity search
- **Metadata Management** - File information, chunk indices, and document relationships
- **Cosine Similarity** - Optimized for semantic document retrieval

```python
class VectorStore:
    def add_chunks(chunks: List[str], file_info: Dict[str, Any]) -> None
    def search(query: str, k: int = 5) -> List[Dict]
    def get_all_chunks() -> List[Dict]
    def delete_file_chunks(file_name: str) -> None
```

### 🤖 LLM Service (`llm_service.py`)
Mistral LLM integration via Ollama:
- **Local Model** - Uses Mistral 7B model through Ollama
- **Context Formation** - Intelligent prompt construction with retrieved chunks
- **Response Generation** - Contextual answer generation based on document content
- **Error Handling** - Graceful fallbacks and error reporting

```python
class LLMService:
    def generate_answer(question: str, relevant_chunks: List[Dict]) -> str
```

## 🌐 API Endpoints

### Document Management

#### `POST /upload`
Upload and process documents for Q&A.

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body**: File upload (TXT, PDF, DOCX, max 10MB)

**Response:**
```json
{
  "original_filename": "document.pdf",
  "saved_as": "document_uuid.pdf",
  "saved_to": "uploads/document_uuid.pdf",
  "content_type": "application/pdf",
  "size": 1024000,
  "extracted_text": "Document content...",
  "chunks": ["chunk1...", "chunk2..."],
  "duplicate": false
}
```

**Features:**
- Duplicate detection using MD5 hashing
- File size validation (10MB limit)
- File type validation (TXT, PDF, DOCX)
- Automatic text extraction and chunking
- ChromaDB vector storage
- Comprehensive error handling

#### `GET /uploaded-files`
Retrieve list of all uploaded files and their metadata.

**Response:**
```json
{
  "uploaded_files": {
    "file_hash": {
      "original_filename": "document.pdf",
      "saved_as": "document_uuid.pdf",
      "saved_to": "uploads/document_uuid.pdf",
      "content_type": "application/pdf",
      "size": 1024000,
      "extracted_text": "...",
      "chunks": ["..."]
    }
  }
}
```

### Question Answering

#### `POST /ask`
Ask questions and receive AI-generated answers based on uploaded documents.

**Request:**
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body**: `question=Your question here`

**Response:**
```json
{
  "answer": "AI-generated answer based on document content",
  "chunks_used": [
    {
      "chunk": "Relevant text chunk",
      "metadata": {
        "file_name": "document.pdf",
        "chunk_index": 5,
        "file_path": "uploads/document_uuid.pdf"
      },
      "distance": 0.85
    }
  ],
  "question": "Your original question"
}
```

#### `POST /query`
Raw vector search for similar document chunks.

**Request:**
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body**: `query=Search terms`

**Response:**
```json
{
  "results": [
    {
      "chunk": "Matching text chunk",
      "metadata": { "file_name": "document.pdf", "chunk_index": 3 },
      "distance": 0.92
    }
  ]
}
```

### System Endpoints

#### `GET /health`
Health check endpoint for monitoring and load balancing.

#### `GET /`
Welcome message and API information.

#### `GET /docs`
Interactive API documentation (Swagger UI).

## 🔧 Configuration

### Environment Variables
Create a `.env` file or configure via environment:

```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_EXTENSIONS=txt,pdf,docx

# ChromaDB Configuration
CHROMA_DB_PATH=./chroma_db
COLLECTION_NAME=documents

# LLM Configuration
OLLAMA_MODEL=mistral:7b
OLLAMA_HOST=http://localhost:11434
```

### Application Settings (`config.py`)
```python
# File processing settings
CHUNK_SIZE = 20          # Sentences per chunk
CHUNK_OVERLAP = 2        # Sentence overlap between chunks
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Vector search settings
DEFAULT_SEARCH_RESULTS = 5
SIMILARITY_THRESHOLD = 0.7

# LLM settings
LLM_MODEL = "mistral:7b"
MAX_CONTEXT_LENGTH = 4096
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10 or higher
- Ollama with Mistral 7B model
- Git (for development)

### 1. Install Ollama and Mistral
```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Download Mistral model
ollama pull mistral:7b

# Start Ollama service
ollama serve
```

### 2. Setup Python Environment
```bash
# Navigate to backend directory
cd qa-backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Application
```bash
# Development server with auto-reload
uvicorn app.main:app --reload

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# With custom configuration
uvicorn app.main:app --reload --log-level debug
```

The API will be available at:
- **Main API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **OpenAPI Spec**: http://localhost:8000/openapi.json

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:8000/health

# Upload a document
curl -X POST "http://localhost:8000/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_document.pdf"

# Ask a question
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "question=What is this document about?"

# Search for similar chunks
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=machine learning"
```

### Automated Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=app --cov-report=html
```

## 📊 Performance Optimization

### Vector Database
- **ChromaDB Settings**: Optimized for similarity search performance
- **Indexing**: HNSW (Hierarchical Navigable Small World) for fast approximate search
- **Memory Management**: Efficient chunk storage and retrieval
- **Batch Processing**: Optimized for multiple document uploads

### Text Processing
- **Chunking Strategy**: Overlapping chunks preserve context across boundaries
- **Sentence Segmentation**: NLTK punkt tokenizer for accurate sentence splitting
- **Similarity Calculation**: Cached embeddings for repeated calculations

### LLM Integration
- **Model Caching**: Ollama keeps models loaded in memory
- **Context Optimization**: Intelligent chunk selection and prompt formatting
- **Response Streaming**: Support for streaming responses (future enhancement)

## 🔒 Security Considerations

### File Upload Security
- **File Type Validation**: Strict whitelist of allowed file extensions
- **File Size Limits**: Configurable maximum file size (default 10MB)
- **Content Validation**: Basic file header validation
- **Unique Filenames**: UUID-based naming prevents conflicts

### Data Privacy
- **Local Processing**: All data stays on your local machine
- **No External API Calls**: Uses local Ollama instance for LLM
- **Secure Storage**: Files stored in designated upload directory

### API Security
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: No sensitive information in error messages
- **Rate Limiting**: Can be added with middleware (future enhancement)

## 🐛 Troubleshooting

### Common Issues

**1. "Model not found" errors**
```bash
# Check if Mistral is installed
ollama list

# Download if missing
ollama pull mistral:7b

# Restart Ollama
ollama serve
```

**2. ChromaDB errors**
```bash
# Clear ChromaDB if corrupted
rm -rf chroma_db/
# Restart the application to recreate
```

**3. File upload failures**
- Check file size (max 10MB)
- Verify file format (TXT, PDF, DOCX)
- Ensure sufficient disk space
- Check file permissions

**4. PDF extraction issues**
```bash
# Install additional PDF dependencies if needed
pip install PyMuPDF  # Alternative PDF parser
pip install pdfplumber  # Alternative PDF parser
```

**5. Memory issues with large files**
- Reduce chunk size in `chunking.py`
- Increase system memory allocation
- Process files individually rather than in batches

### Debugging

#### Enable Debug Logging
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Check Application Logs
```bash
# Run with verbose logging
uvicorn app.main:app --reload --log-level debug

# Monitor file uploads
tail -f uploaded_files.json

# Check ChromaDB status
ls -la chroma_db/
```

#### Performance Monitoring
```python
# Add timing decorators to functions
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper
```

## 📈 Monitoring & Logging

### Health Monitoring
- **Health Endpoint**: `/health` for load balancer checks
- **Metrics Collection**: Ready for Prometheus integration
- **Status Tracking**: ChromaDB connection, Ollama availability

### Application Logging
```python
# Structured logging example
import logging
import json

logger = logging.getLogger(__name__)

# Log upload events
logger.info(json.dumps({
    "event": "file_upload",
    "filename": filename,
    "size": file_size,
    "chunks_created": len(chunks),
    "processing_time": processing_time
}))
```

## 🚢 Deployment

### Docker Deployment
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations
- **Reverse Proxy**: Use Nginx or Traefik for SSL termination
- **Process Management**: Use Gunicorn with Uvicorn workers
- **File Storage**: Consider cloud storage for uploaded files
- **Database**: PostgreSQL for metadata storage in production
- **Monitoring**: Add APM tools like New Relic or DataDog

## 🔮 Future Enhancements

### Planned Features
- **Async File Processing**: Background processing for large files
- **Advanced Search**: Hybrid search combining vector and keyword search
- **Model Flexibility**: Support for multiple LLM models and providers
- **API Versioning**: Versioned API endpoints for backward compatibility
- **Caching Layer**: Redis integration for response caching
- **Database Support**: PostgreSQL integration for scalable metadata storage

### Potential Integrations
- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob
- **Authentication**: OAuth2, JWT token-based authentication
- **Message Queues**: Redis, RabbitMQ for async processing
- **Monitoring**: Prometheus metrics, Grafana dashboards
- **Search Engines**: Elasticsearch integration for hybrid search

---

**Built with FastAPI for high-performance document processing and AI-powered Q&A** 🚀
