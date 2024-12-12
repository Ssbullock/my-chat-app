const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages must be an array' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model || 'gpt-3.5-turbo', // default to gpt-3.5-turbo if no model provided
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    const assistantReply = response.data.choices[0].message.content;
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
