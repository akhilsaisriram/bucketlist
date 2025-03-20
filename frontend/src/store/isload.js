import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    ismenu:false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setmenu: (state, action) => {
      state.ismenu = action.payload;
    },
  },
});

export const {setLoading,setmenu}  = loadingSlice.actions;

export default loadingSlice;