# DocQA Engine

A modern, AI-powered document question-answering system built with FastAPI, React, ChromaDB, and Mistral LLM. Upload documents and ask questions to get intelligent answers based on the content.

![DocQA Engine Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18.2+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

## ✨ Features

### 🚀 Core Functionality
- **Smart Document Processing** - Supports TXT, PDF, and DOCX files
- **Intelligent Chunking** - Splits documents into semantically meaningful chunks
- **Vector Storage** - Uses ChromaDB for efficient similarity search
- **AI-Powered Q&A** - Leverages Mistral 7B for context-aware responses
- **Source Attribution** - Shows which documents were used for each answer

### 🎨 Modern UI
- **React Frontend** - Beautiful, responsive interface with Tailwind CSS
- **Drag & Drop Upload** - Intuitive file upload experience
- **Real-time Chat** - Interactive Q&A interface with typing indicators
- **Document Library** - Comprehensive view of uploaded files with metadata
- **Mobile Friendly** - Works seamlessly on all devices

### 🔧 Technical Features
- **Duplicate Detection** - MD5 hashing prevents duplicate uploads
- **Persistent Storage** - Files and embeddings persist across sessions
- **Error Handling** - Graceful error handling and user feedback
- **Local LLM** - Uses Ollama with Mistral for privacy and cost efficiency

## 🏗️ Architecture

```
DocQA Engine
├── qa-backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py      # Main API endpoints
│   │   └── services/    # Core services
│   │       ├── document_processor.py  # File text extraction
│   │       ├── chunking.py           # Text chunking & similarity
│   │       ├── embeddings.py         # (Legacy - replaced by ChromaDB)
│   │       ├── vector_store.py       # ChromaDB integration
│   │       └── llm_service.py        # Mistral LLM integration
│   └── requirements.txt
├── qa-frontend/          # React frontend
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── index.js     # React entry point
│   │   └── index.css    # Tailwind CSS styles
│   └── package.json
└── testfiles/           # Sample test documents
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 16+**
- **Ollama** with Mistral 7B model

### 1. Install Ollama and Mistral

```bash
# Install Ollama (macOS)
curl -fsSL https://ollama.ai/install.sh | sh

# Download Mistral model
ollama pull mistral:7b

# Verify Ollama is running
ollama serve
```

### 2. Setup Backend

```bash
# Clone the repository
git clone <your-repo-url>
cd DocQA-Engine

# Setup Python environment
cd qa-backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### 3. Setup Frontend

```bash
# In a new terminal
cd qa-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will be available at `http://localhost:3000`

## 📖 Usage

### Upload Documents
1. **Drag and drop** files or click to browse
2. **Supported formats**: TXT, PDF, DOCX (max 10MB each)
3. **Processing**: Files are automatically chunked and stored in ChromaDB
4. **Library**: View all uploaded documents in the Document Library panel

### Ask Questions
1. **Type your question** in the chat interface
2. **AI Response**: Get intelligent answers based on your documents
3. **Source Attribution**: See which documents were used for the answer
4. **Context**: View relevant chunks that informed the response

### Example Questions
- "What are the main themes in this document?"
- "Who are the key characters mentioned?"
- "Summarize the important points"
- "What happens in chapter 3?"

## 🛠️ API Endpoints

### Backend API (`http://localhost:8000`)

- **`POST /upload`** - Upload and process documents
- **`POST /ask`** - Ask questions and get AI-generated answers
- **`POST /query`** - Search for similar chunks (raw results)
- **`GET /uploaded-files`** - Get list of uploaded files
- **`GET /health`** - Health check endpoint
- **`GET /docs`** - Interactive API documentation

### Example API Usage

```bash
# Upload a document
curl -X POST "http://localhost:8000/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"

# Ask a question
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "question=What is this document about?"
```

## 🔧 Configuration

### Backend Configuration

- **Chunk Size**: 20 sentences with 2 sentence overlap (configurable in `chunking.py`)
- **File Size Limit**: 10MB per file (configurable in `main.py`)
- **Supported Files**: TXT, PDF, DOCX (configurable in `main.py`)
- **Vector Database**: ChromaDB with cosine similarity
- **LLM Model**: Mistral 7B via Ollama

### Frontend Configuration

- **Proxy**: Configured to proxy API requests to `http://localhost:8000`
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React icon library

## 🧪 Testing

### Test with Sample Files
```bash
# Upload test files via API
curl -X POST "http://localhost:8000/upload" \
  -F "file=@testfiles/foo.txt"

# Test Q&A
curl -X POST "http://localhost:8000/ask" \
  -d "question=What happens in the story?"
```

### Development Testing
- Backend API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m "Add feature description"`
6. **Push**: `git push origin feature-name`
7. **Create a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- **Multi-language Support** - Support for documents in different languages
- **Advanced Filtering** - Filter search results by document type, date, etc.
- **Conversation Memory** - Remember context across multiple questions
- **Document Analysis** - Automatic document summarization and insights
- **Team Collaboration** - Multi-user support with document sharing
- **Cloud Deployment** - Docker containers and cloud deployment guides

## 🐛 Troubleshooting

### Common Issues

**1. "Command not found: npm"**
- Install Node.js from https://nodejs.org/

**2. "Unknown at rule @tailwind"**
- Run `npm install` to install Tailwind CSS properly

**3. "Connection refused" errors**
- Ensure both backend (port 8000) and frontend (port 3000) are running
- Check if Ollama is running: `ollama serve`

**4. Empty search results**
- Verify documents are uploaded successfully
- Check if Mistral model is downloaded: `ollama list`
- Try rephrasing your question

**5. Upload failures**
- Check file size (max 10MB)
- Verify file format (TXT, PDF, DOCX only)
- Ensure backend is running and accessible

### Getting Help

- **Check the logs** - Both frontend (browser console) and backend (terminal)
- **API Documentation** - Visit `http://localhost:8000/docs`
- **GitHub Issues** - Report bugs and request features

## 🎯 Performance Tips

- **Optimal chunk size** - 20 sentences works well for most documents
- **File organization** - Upload related documents together for better context
- **Question phrasing** - Be specific and use terms from your documents
- **Hardware** - More RAM improves ChromaDB performance with large document collections

---

**Built with ❤️ for intelligent document interaction**
