import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user data based on token in session storage
export const fetchUserData = createAsyncThunk('user/fetchUserData', async (_, { rejectWithValue }) => {
  const token = sessionStorage.getItem('token');

  if (!token) return rejectWithValue('No token found');
  
  try {
    const response = await axios.get(`${window._env_.REACT_APP_BASE_URL}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch user data');
  }
});

export const user = createSlice({
  name: 'user',
  initialState: {
    user: null,   // User data will be stored here after fetching
    notify: [],   // Notification array
    status: 'idle',
    error: null,
  },
  reducers: {
    setuser: (state, action) => {
      const existing = state.notify.find((item) => item === action.payload);
      if (!existing) {
        state.notify.push(action.payload);
      }
    },
    setuserfollower: (state, action) => {
      const {  following } = action.payload;
      if (state.user && state.user.frends[0].following) {
        state.user.frends[0].following=following
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.notify = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setuser, clearUser,setuserfollower } = user.actions;
export default user.reducer;
