import React from "react";
import "./Sidebar.css";

const Sidebar = ({ getMessages, chats, activeChatId, onNewChat, onSwitchChat, isOpen }) => {
    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className="new-chat-btn" onClick={onNewChat}>
                + New Chat
            </button>
            <h3 className="sidebar-title">Previous Chats</h3>
            <ul>
                {chats.map((chat, index) => (
                    <li
                        key={chat._id || index}
                        className={`sidebar-item ${chat._id === activeChatId ? "active" : ""}`}
                        onClick={() => { onSwitchChat(chat._id), getMessages(chat._id) }}
                    >
                        {chat.title}
                    </li>))}
            </ul>
        </aside>
    );
};

export default Sidebar;
