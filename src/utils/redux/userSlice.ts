import { IUser } from './../../types';
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'authUser',
  initialState: {
    userId: '',
    user: {} as IUser,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.userId = action.payload;
    },

    setUserProps: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser, setUserProps } = userSlice.actions;
export default userSlice.reducer;
