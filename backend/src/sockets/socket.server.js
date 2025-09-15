const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.server');
const { Chat } = require("@google/genai");
const messageModel = require('../models/message.model')
const { createMemory, queryMemory } = require('../services/vector.service');

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")

        if (!cookies.token) {
            next(new Error("Authentication error : No token provided"))
        }
        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        } catch (error) {
            next(new Error("Authentication error : Invalid token "))
        }
    })

    io.on('connection', (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            console.log(messagePayload);
            try {
                // Save user message and generate vector concurrently
                const [userMessage, userVectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: messagePayload.content,
                        role: "user"
                    }),
                    aiService.generateVector(messagePayload.content)
                ]);

                // Create user message memory
                await createMemory({
                    vectors: userVectors,
                    messageId: userMessage._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        text: messagePayload.content
                    }
                });

                // Get long-term and short-term memory concurrently
                const [memory, chatHistory] = await Promise.all([
                    queryMemory({
                        queryVector: userVectors,
                        limit: 3,
                        metadata: {
                            user: socket.user._id
                        }
                    }),
                    messageModel.find({
                        chat: messagePayload.chat
                    }).sort({ createdAt: 1 }).lean() // Corrected: Sort by creation date ascending
                ]);

                const stm = chatHistory.map(item => ({
                    role: item.role,
                    parts: [{ text: item.content }]
                }));

                const ltm = [{
                    role: "user",
                    parts: [{
                        text: `these are some previous messages. from the chat, use them to generate a response ${memory.map(item => item.metadata.text).join("\n")}`
                    }]
                }];

                // Generate AI response
                const response = await aiService.generateResponse([...ltm, ...stm]);

                // Check if the AI response is valid before saving
                if (response && response.trim() !== "") {
                    // Send AI response to client
                    socket.emit("ai-response", {
                        content: response,
                        chat: messagePayload.chat
                    });

                    // Save AI message and generate vector concurrently
                    const [aiMessage, responseVectors] = await Promise.all([
                        messageModel.create({
                            chat: messagePayload.chat,
                            user: null, // AI messages don't have a user, set to null or remove if not required
                            content: response,
                            role: "model"
                        }),
                        aiService.generateVector(response)
                    ]);

                    // Create AI message memory
                    await createMemory({
                        vectors: responseVectors,
                        messageId: aiMessage._id,
                        metadata: {
                            chat: messagePayload.chat,
                            user: socket.user._id,
                            text: response
                        }
                    });
                } else {
                    // Handle cases where AI returns an empty or null response
                    console.error("AI service returned an empty or invalid response.");
                    // You might want to send an error message back to the client here
                }
            } catch (error) {
                console.error("An error occurred during message processing:", error);
                // Send an error message back to the client
                socket.emit("error", { message: "Failed to process your request." });
            }
        });
    });
}

module.exports = initSocketServer;
