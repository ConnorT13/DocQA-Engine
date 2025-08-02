import PyPDF2
import logging
from docx import Document

logger = logging.getLogger(__name__)


def extract_text_from_file(file_path: str, file_extension: str) -> str:
    """Extract text content"""
    try:
    
        if file_extension == '.txt':
            return extract_text_from_txt(file_path)

        if file_extension == '.pdf':
            return extract_text_from_pdf(file_path)

        if file_extension == '.docx':
            return extract_text_from_docx(file_path)
        
        else:
            raise ValueError("")

    except Exception as e:
        logger.error(f"Error extracting text from {file_path}: {str(e)}")
        raise


def extract_text_from_txt(file_path):
    try:
        with open(file_path, "r", encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        with open(file_path, "r", encoding='latin-1') as f:
            return f.read()

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)

            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"

        return text.strip()

    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        text = []
        
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
            
        return '\n'.join(text)
    except Exception as e:
        raise Exception(f"Failed to extract text from DOCX: {str(e)}")
