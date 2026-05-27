const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend cross-origin requests
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// ========================
// API ENDPOINTS
// ========================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'VMath Backend API is running smoothly.',
        timestamp: new Date().toISOString()
    });
});

// Chatbot proxy endpoint (OpenRouter API integration)
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format. Expected an array of message objects.' });
    }

    const API_KEY = process.env.API_KEY;
    const AI_MODEL = process.env.AI_MODEL || 'google/gemini-2.5-flash';

    if (!API_KEY) {
        console.error("❌ Error: API_KEY is missing from environment variables (.env file).");
        return res.status(500).json({ 
            error: 'Server misconfiguration', 
            details: 'OpenRouter API_KEY is not defined in the backend environment variables (.env file).' 
        });
    }

    try {
        console.log(`🤖 [AI Chat Request] Sending request to OpenRouter using model: ${AI_MODEL}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': req.headers.referer || 'http://localhost:5000',
                'X-Title': 'VMath AI'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: messages
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`❌ OpenRouter API returned error status ${response.status}: ${errText}`);
            return res.status(response.status).json({ 
                error: `OpenRouter API Error (${response.status})`, 
                details: errText 
            });
        }

        const data = await response.json();
        console.log(`✅ [AI Chat Response] Successfully received response from AI.`);
        return res.status(200).json(data);

    } catch (error) {
        console.error("❌ Exception occurred during AI Chat execution:", error);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
});

// ========================
// FRONTEND STATIC ROUTING
// ========================

// Serve static assets (CSS, JS, Images) from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Route for the get started page
app.get('/get-started', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'get-started.html'));
});

// Fallback for clean URL navigation support (SPA styling)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 VMath Backend Server is successfully running!`);
    console.log(`🔊 Listening on port: ${PORT}`);
    console.log(`🔗 Local server URL: http://localhost:${PORT}`);
    console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`📁 Static files folder: ${path.resolve(__dirname, '..')}`);
    console.log(`==================================================\n`);
});
