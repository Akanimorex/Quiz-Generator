require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const AIML_API_URL = "https://api.aimlapi.com/v1/chat/completions";
const AIML_API_KEY = process.env.SECOND_API_KEY; // Store key in .env

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      AIML_API_URL,
      {
        "frequency_penalty": 1,
        "max_tokens": 30,  // Reduce token count to prevent long outputs
        "temperature": 0, // Reduce randomness for structured output
        "model": "deepseek/deepseek-chat",
        "messages": [
            { "role": "system", "content": "You generate three multiple-choice quiz questions." },
            { "role": "user", "content": `Quiz on ${userMessage}. Format: Q: ? A) B) C) D) Answer:` }
            ]
      },
      {
        headers: {
          "Authorization": `Bearer ${AIML_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Ensure response structure is handled correctly
    const aiResponse = response.data.choices?.[0]?.message?.content || "No response available";

    res.json({ reply: aiResponse });

  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ reply: "Error processing your request" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));