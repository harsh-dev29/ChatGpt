import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    activeChatId: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        createNewChat: (state, action) => {
            const { title, _id } = action.payload;
            state.chats.push({
                _id,
                title,
                messages: [],
            });
            state.activeChatId = _id // Switch to new chat automatically
        },
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            const chat = state.chats.find((c) => c._id == chatId);
            if (chat) {
                chat.messages.push(message);
            }
        },
        switchChat: (state, action) => {
            state.activeChatId = action.payload;
        },
        setChats: (state, action) => {
            // FIX: Map over the incoming chats and ensure each has a `messages` array
            state.chats = action.payload.map(chat => ({
                ...chat,
                messages: chat.messages || [] // If messages exists, use it; otherwise, initialize it as an empty array
            }));
        },
        setMessagesForChat: (state, action) => {
            const { chatId, messages } = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                chat.messages = messages;
            }
        }
    },
});

export const { createNewChat, addMessage, switchChat, setChats, setMessagesForChat } = chatSlice.actions;
export default chatSlice.reducer;
