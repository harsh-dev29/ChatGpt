import React, { useEffect, useState } from "react";
import { LogIn, Menu, Plus, TruckElectric } from "lucide-react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatBox from "../components/ChatBox/ChatBox";
import ChatInput from "../components/ChatInput/ChatInput";
import { addMessage, createNewChat, setChats, setMessagesForChat, switchChat } from "../store/chatSlice";
import axios from "axios";
import "../styles/theme.css";
import ThemeToggle from './../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

// Declare socket outside the component to ensure a single instance
const socket = io("https://chatgpt-cwfx.onrender.com", {
    withCredentials: true,
});

const Home = () => {
    const dispatch = useDispatch();
    const { chats, activeChatId } = useSelector((state) => state.chat);

    const [input, setInput] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const navigate = useNavigate()

    // The dependency array ensures this effect runs once on mount

    const activeChat = chats.find((c) => c._id === activeChatId);
    const [messages, setMessages] = useState([])
    const newMsgs = activeChat ? activeChat.messages : []
    // const [messages, setMessages] = useState([])
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChatId) return;

        // Correct the user message format to match the backend's expectations.
        // It should have content and a role.
        const userMsg = {
            content: input,
            role: "user"
        };

        // Emit the message to the backend
        socket.emit("ai-message", {
            chat: activeChatId,
            content: input
        });

        console.log("User message sent:", userMsg);

        // Dispatch the user message to Redux immediately for a fast UI update
        dispatch(addMessage({ chatId: activeChatId, message: userMsg }));
        setInput("");
    };

    const getMessages = async (chatId) => {
        const response = await axios.get(`https://chatgpt-cwfx.onrender.com/api/chat/messages/${chatId}`, { withCredentials: true })
        console.log("Fetched messages for chat:", response.data.messages);
        setMessages(response.data.messages.map(m => ({
            content: m.content,
            role: m.role
        })))
        const fetchedMessages = response.data.messages.map(m => ({
            content: m.content,
            role: m.role
        }));
        dispatch(setMessagesForChat({ chatId: chatId, messages: fetchedMessages }));
    }

    useEffect(() => {
        if (activeChatId) {
            // Check if the chat's messages are already loaded
            const chatToLoad = chats.find(c => c._id === activeChatId);
            if (chatToLoad && (!chatToLoad.messages || chatToLoad.messages.length === 0)) {
                // If messages are not loaded, fetch them from the backend
                getMessages(activeChatId);
            }
        }
    }, [activeChatId, chats, dispatch]);

    const handleNewChat = async () => {
        const title = prompt("Enter a title for you new chat:")
        if (!title) return

        const respsonse = await axios.post('https://chatgpt-cwfx.onrender.com/api/chat', {
            title
        }, {
            withCredentials: true
        })
        getMessages(respsonse.data.chat._id)
        console.log(respsonse.data);
        dispatch(createNewChat(respsonse.data.chat))
        setMobileSidebarOpen(false);

    };


    const handleSwitchChat = (id) => {
        dispatch(switchChat(id));
        setMobileSidebarOpen(false);
    };
    useEffect(() => {
        // Fetch chats from the backend on component mount
        axios.get("https://chatgpt-cwfx.onrender.com/api/chat", { withCredentials: true }).then(response => {
            // Ensure messages array exists for each chat before setting the state
            const chatsWithMessages = response.data.chats.map(chat => ({
                ...chat,
                messages: chat.messages || []
            }));
            dispatch(setChats(chatsWithMessages.reverse()));

        });

        // Set up the socket listener for AI responses
        socket.on("ai-response", (messagePayload) => {
            console.log("Received AI message:", messagePayload.content);

            // Correct the AI message format to match your reducer's expectations.
            // Your reducer expects an object with 'content' and 'role' properties.
            const aiMsg = {
                content: messagePayload.content,
                role: "model"
            };

            // Dispatch the message to the correct chat.
            // Using messagePayload.chat directly to avoid stale state issues with activeChatId
            dispatch(addMessage({ chatId: messagePayload.chat, message: aiMsg }));
            getMessages(chats.chat._id)
        });

        // Clean up the socket listener when the component unmounts
        return () => {
            socket.off("ai-response");
        };
    }, [dispatch]);


    return (
        <>
            <div className="theme-toggle">
                <ThemeToggle />
            </div>
            <div className="home-container">

                {/* Sidebar */}
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    onNewChat={handleNewChat}
                    onSwitchChat={handleSwitchChat}
                    isOpen={mobileSidebarOpen}
                    getMessages={getMessages}
                />

                {/* Main area */}
                <main className="chat-container">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    >
                        <Menu size={22} />
                    </button>

                    {!activeChatId ? (
                        <div className="chat-empty">
                            <h1>Welcome 👋</h1>
                            <p>Start a new chat to begin your conversation.</p>
                        </div>
                    ) : (
                        <ChatBox
                            messages={activeChat.messages} />
                    )}

                    <div className="chat-input-container">
                        {activeChatId && <ChatInput input={input} setInput={setInput} handleSend={handleSend} />}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Home;
