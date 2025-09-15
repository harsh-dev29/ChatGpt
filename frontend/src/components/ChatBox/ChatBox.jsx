import React, { useEffect, useRef } from "react";
import "./ChatBox.css";

const ChatBox = ({ messages }) => {
    if (!messages || messages.length === 0) {
        return (
            <div className="chat-box empty">
                <p>No messages yet...</p>
            </div>
        );
    }
    const chatContainerRef = useRef(null);

    // 2. Use useEffect to scroll to the bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className="chat-box" ref={chatContainerRef}>
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`chat-message ${msg.role == "user" ? "user-msg" : "ai-msg"}`}
                >
                    {msg.content}
                </div>
            ))}
        </div>
    );
};

export default ChatBox;
