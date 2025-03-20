// store/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
  },
  reducers: {
    connectSocket: (state) => {
      if (!state.socket) {
        const socket = io('${window._env_.REACT_APP_BASE_URL_CHAT}', { path: '/notify-socket' });
        state.socket = socket;
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
    joinRoom: (state, action) => {
      if (state.socket) {
        const {  uid } = action.payload;
        const room="@123";
        state.socket.emit("joinRoomnotify", { room, uid });
        console.log(`Joined room: ${room} with uid: ${uid}`);
      }
    },
  },
});

export const { connectSocket, disconnectSocket, joinRoom } = socketSlice.actions;
export default socketSlice.reducer;
