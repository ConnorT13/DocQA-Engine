from fastapi import FastAPI, UploadFile, File
import uuid
import os
import json
import hashlib

app = FastAPI(
    title="Q&A Engine API",
    description="A LLM project",
    version="1.0.0"
)

uploaded_files = {} # for hashing (file info)


def get_file_hash(file_content: bytes) -> str:
    return hashlib.md5(file_content).hexdigest()

def save_uploaded_files():
    with open("uploaded_files.json", "w") as f:
        json.dump(uploaded_files, f, indent=2)


def load_uploaded_files():
    global uploaded_files
    try:
        with open("uploaded_files.json", "r") as f:
            uploaded_files = json.load(f)
        print(f"Loaded {len(uploaded_files)} previously uploaded files")
    except FileNotFoundError:
        print("No Previous Uploads Found, starting new")
        uploaded_files = {}


load_uploaded_files()


@app.get("/")
def read_root():
    return {"message": "Hello World!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    max_size = 10 * 1024 * 1024

    if len(content) > max_size:
        return {
            "error": "File Too Large",
            "message": f"File size ({len(content):,} bytes) exceeds limit ({max_size:,} bytes)",
            "max_size_mb": 10
        }
        
    if len(content) == 0:
        return{
            "error": "Empty File",
            "size": file.size,
            "message": "File contains no content"
        }

    allowed_extensions = ['txt', 'pdf', 'docx']
    file_extension = file.filename.split('.')[-1].lower()

    if file_extension not in allowed_extensions:
        return{
            "error": "File type not supported",
            "message": f"Please only submit .txt, .pdf, or .docx documents"
        }



    file_hash = get_file_hash(content)

    if file_hash in uploaded_files:
        existing_file = uploaded_files[file_hash]
        return {
            "message": "File already exists!",
            "original_filename": file.filename,
            "existing_file": existing_file,
            "duplicate": True
        }

    os.makedirs("uploads", exist_ok=True)

    name_without_ext = file.filename.rsplit('.', 1)[0]
    extension = file.filename.rsplit('.', 1)[1]
    unique_filename = f"{name_without_ext}_{uuid.uuid4()}.{extension}"

    file_path = f"uploads/{unique_filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    file_info = {
        "original_filname": file.filename,
        "saved_as": unique_filename,
        "saved_to": file_path,
        "content_type": file.content_type,
        "size": file.size
    }

    uploaded_files[file_hash] = file_info
    
    save_uploaded_files()

    return {**file_info, "duplicate": False}

@app.post("/test-hash")
async def test_hash(file: UploadFile = File(...)):
    content = await file.read()
    file_hash = get_file_hash(content)

    return {
        "filename": file.filename,
        "hash": file_hash,
        "size": len(content)
    }

