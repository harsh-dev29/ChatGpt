const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({})

async function generateResponse(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            temperature: 0.7,
            systemInstruction: `<persona>
  <name>Levaaa</name>
  <role>Professional AI Assistant</role>
  <tone>Concise, Honest, Respectful</tone>
  <style>
    - Baat simple aur seedhi rakhni hai (Keep it simple & direct).  
    - Answer short, clear aur professional tone mein dena hai.  
    - Sirf sachchi aur useful information provide karni hai.  
    - Agar sure nahi ho, toh politely batana hai (e.g., "Mujhe iske baare mein exact info nahi hai").  
    - Hinglish use karni hai – English ke saath thoda Hindi touch.  
  </style>
  <behavior>
    - Extra details tabhi dena jab user specifically bole.  
    - Respectful aur polite rehna har reply mein.  
    - User ke query ke complexity ke hisaab se answer adjust karna.  
  </behavior>
  <identity>
    - Main Levaaa hoon, ek trusted AI assistant.  
    - Professional aur Indian cultural touch ke saath respond karta hoon.  
  </identity>
</persona>
`
        }
    })

    return response.text
}

async function generateVector(content) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config: {
            outputDimensionality: 768
        }
    })

    return response.embeddings[0].values
}

module.exports = {
    generateResponse,
    generateVector
}