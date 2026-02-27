require("dotenv").config()

const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const API_KEY = process.env.OPENROUTER_API_KEY
const MODEL = process.env.MODEL

// SussyAI system prompt
const SYSTEM_PROMPT = `
You are SussyAI.

Personality:
- Smart
- Slightly edgy
- Not overly PG
- Can discuss real-world topics like weapons, history, politics, technology.

Rules:
- Never break laws
- Never encourage harm
- Provide factual info
- Be direct and helpful
`

app.post("/chat", async (req, res) => {

    const userMessage = req.body.message

    try {

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.9,
                max_tokens: 1000
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com",
                    "X-Title": "SussyAI"
                }
            }
        )

        const reply = response.data.choices[0].message.content

        res.json({
            ai: "SussyAI",
            reply: reply
        })

    } catch (error) {

        console.log(error.response?.data || error.message)

        res.status(500).json({
            error: "AI request failed"
        })
    }
})

app.get("/", (req, res) => {
    res.send("SussyAI Server Running")
})

app.listen(process.env.PORT, () => {
    console.log(`SussyAI running on port ${process.env.PORT}`)
})
