import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  id: string;
  userId: string;
  body: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  users: string[];
  userId: string | null;
  connected: boolean;
}

const initialState: ChatState = {
  messages: [],
  users: [],
  userId: null,
  connected: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setUsers(state, action: PayloadAction<string[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<string>) {
      if (!state.users.includes(action.payload)) {
        state.users.push(action.payload);
      }
    },
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u !== action.payload);
    },
    enqueueMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    wsConnected(state) {
      state.connected = true;
    },
    wsDisconnected(state) {
      state.connected = false;
    },
    connectRequested(_state) {},
    disconnectRequested(_state) {},
    sendMessage(_state, _action: PayloadAction<string>) {},
    renameUserRequested(_state, _action: PayloadAction<{ oldId: string; newId: string }>) {},
  }
})

export const {
  enqueueMessage,
  wsConnected,
  wsDisconnected,
  connectRequested,
  disconnectRequested,
  sendMessage,
  setUserId,
  addUser,
  removeUser,
  setUsers,
  renameUserRequested
} = chatSlice.actions
export default chatSlice.reducer;