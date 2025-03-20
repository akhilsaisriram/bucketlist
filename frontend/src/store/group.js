import { createSlice } from '@reduxjs/toolkit';

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    group_members: [],
    group:{},
  },
  reducers: {
    add_group: (state, action) => {
        const newMember = action.payload;
        const exists = state.group_members.some(member =>
          JSON.stringify(member) === JSON.stringify(newMember)
        );
        if (!exists) {
          state.group_members.push(newMember);
        }
      },
     group_place: (state, action) => {
      
          state.group=action.payload;
        
      },
    del_group: (state, action) => {
      state.group_members = state.group_members.filter(member => member.uid !== action.payload.uid);
    },
  },
});

// Export actions
export const { add_group, del_group, group_place} = groupSlice.actions;

// Export reducer
export default groupSlice;
