# write a simple webhook in python using fastapi
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import json
import asyncio
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# Create FastAPI app
app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Define the webhook endpoint
@app.post("/webhook")
async def webhook(request: Request):
    try:
        # Get the request body
        body = await request.json()
        # Log the request body
        logger.info(f"Received webhook: {body}")
        # Return a JSON response
        return JSONResponse(content={"status": "success", "data": body})
    except json.JSONDecodeError:
        # Handle the case when the request body is not valid JSON
        body_text = await request.body()
        logger.warning(f"Received non-JSON webhook: {body_text}")
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "Invalid JSON payload"}
        )

@app.post("/process-paragraph")
async def process_paragraph(request: Request):
    try:
        # Get the request body as JSON
        data = await request.json()
        paragraph = data.get("paragraph", "")
        
        if not paragraph:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "No paragraph provided"}
            )
        
        # Define the streaming response function
        async def generate_sentences():
            # Split the paragraph into sentences (basic split by . ! ?)
            sentences = re.split(r'(?<=[.!?])\s+', paragraph)
            
            for i, sentence in enumerate(sentences):
                if i > 0:
                    # Wait for 5 seconds before sending the next sentence
                    await asyncio.sleep(5)
                
                # Send the sentence with a newline for streaming
                yield f"{sentence}\n"
        
        # Return a streaming response
        return StreamingResponse(
            generate_sentences(),
            media_type="text/plain"
        )
    
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "Invalid JSON payload"}
        )

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)