import ollama
from typing import List, Dict

class LLMService:
    def __init__(self, model_name: str = "mistral:7b"):
        self.model_name = model_name

    def generate_answer(self,question: str, relevant_chunks: List[Dict]) -> str:
        context_parts = []
        for i, chunk in enumerate(relevant_chunks, 1):
            context_parts.append(f"Context {i}:\n{chunk['chunk']}\n")
        context = "\n".join(context_parts)

        prompt = f""" You are a helpful assistant that answers questions based on the provided context.
            Use only the information given in the context to answer the question.

            Context:
            {context}

            Question: {question}

            Answer:"""

        try:
            response = ollama.chat(
                model = self.model_name,
                messages = [{'role': 'user', 'content': prompt}]
            )
            return response['message']['content']
        except Exception as e:
            return f"Error generating answer: {str(e)}"
        