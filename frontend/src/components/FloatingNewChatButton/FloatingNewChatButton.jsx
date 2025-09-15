import React from "react";
import { useDispatch } from "react-redux";
import { createNewChat } from "../../store/chatSlice";

const FloatingNewChatButton = () => {
    const dispatch = useDispatch();

    return (
        <button
            className="floating-chat-btn"
            onClick={() => dispatch(createNewChat())}
        >
            + New Chat
        </button>
    );
};

export default FloatingNewChatButton;
