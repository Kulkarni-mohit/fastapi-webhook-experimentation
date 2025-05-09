# FastAPI Webhook Experimentation

A project demonstrating webhook implementation with FastAPI and a React frontend application for paragraph processing.

## Overview

This project consists of:

1. **FastAPI Backend**: A Python server that provides webhook endpoints including a `/process-paragraph` endpoint that streams sentences back to the client.

2. **React Frontend**: A web application that allows users to input paragraphs and view the processed sentences in a terminal-like interface.

## Features

- RESTful webhook endpoint for general purpose use
- Paragraph processing endpoint with streaming response
- Terminal-styled UI for displaying streamed sentences
- CORS support for local development

## Getting Started

### Backend

```bash
# Install dependencies
pip install fastapi uvicorn

# Run the server
python simpleWebhook.py
```

The server will run at `http://localhost:8000`.

### Frontend

```bash
# Navigate to the React app directory
cd react-paragraph-app

# Install dependencies
npm install

# Start the development server
npm start
```

The React app will be available at `http://localhost:3000`.

## API Endpoints

- `POST /webhook`: General purpose webhook that accepts and returns JSON
- `POST /process-paragraph`: Accepts a JSON payload with a "paragraph" field and streams back sentences with a delay

## Technologies Used

- Backend: FastAPI, Python
- Frontend: React, CSS
