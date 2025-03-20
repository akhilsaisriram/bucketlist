import { createSlice } from '@reduxjs/toolkit';

export const bucketslice = createSlice({
  name: 'bucket',
  initialState: {
    bucket: {}, // Stores bucket data
    polyline: null, // Stores polyline data, initially null
    feed:[]
  },
  reducers: {
    setbucket: (state, action) => {
      state.bucket = action.payload;
    },
    setPolyline: (state, action) => {
      state.polyline = action.payload;
    },
    setfeed: (state, action) => {
      state.feed = action.payload;
    },
  },
});

export const { setbucket, setPolyline ,setfeed} = bucketslice.actions;

export default bucketslice;
