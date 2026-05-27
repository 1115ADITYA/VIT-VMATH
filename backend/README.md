# ✦ VMath AI Backend ✦

Welcome to the backend server for **VMath AI**! This directory contains a robust, lightweight, and modern **Node.js + Express** application. 

This server functions in a **dual-mode**:
1. **API Server**: Hosts a `/api/chat` router that proxies requests to OpenRouter (using Gemini or other models) with full error handling and configuration options.
2. **Static Web Server**: Serves your VMath frontend files (HTML, CSS, JavaScript, and assets) from the parent directory, ensuring that everything runs locally on a single port with zero CORS or relative routing issues!

---

## 🚀 Getting Started

Follow these simple steps to set up and run the server on your system:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18.0.0 or higher recommended). You can verify your version by running:
```bash
node -v
```

### 2. Install Dependencies
Open your terminal, navigate to this `backend` folder, and install the required npm packages:
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
1. Duplicate the `.env.example` file and rename the new copy to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in your text editor.
3. Obtain an API Key from [OpenRouter](https://openrouter.ai/).
4. Set the `API_KEY` in the `.env` file:
   ```env
   API_KEY=your_actual_openrouter_api_key
   ```
5. *(Optional)* Modify the `PORT` (default `5000`) and the `AI_MODEL` (default `google/gemini-2.5-flash`) as desired.

### 4. Run the Server
Start the server in development mode (which automatically restarts the server when files are edited):
```bash
npm run dev
```

Or run in standard production mode:
```bash
npm start
```

Once started, open your web browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🛠️ API Reference

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Description**: Verifies if the backend is running properly.
* **Response**:
  ```json
  {
    "status": "OK",
    "message": "VMath Backend API is running smoothly.",
    "timestamp": "2026-05-27T18:40:00.000Z"
  }
  ```

### 2. Chat Completions Proxy
* **Endpoint**: `POST /api/chat`
* **Description**: Proxies chatbot messages securely to the OpenRouter API.
* **Request Body**:
  ```json
  {
    "messages": [
      { "role": "system", "content": "You are a helpful math tutor." },
      { "role": "user", "content": "What is Euler's formula?" }
    ]
  }
  ```

---

## 📁 Directory Structure
```text
backend/
├── .env.example       # Template file for environment configurations
├── package.json       # Project dependencies and script configurations
├── server.js          # Main Express server and route setup
└── README.md          # Setup and usage guide (this file)
```

Have fun learning and computing with **VMath AI**! 📐✨
