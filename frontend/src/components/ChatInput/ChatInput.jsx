import React, { useEffect } from "react";
import "./ChatInput.css";

const ChatInput = ({ input, setInput, handleSend }) => {

    return (
        <form className="chat-input-box" onSubmit={handleSend}>
            <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chat-input"
            />
            <button type="submit" className="chat-send">➤</button>
        </form>
    );
};

export default ChatInput;
