import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import workplacesReducer from '../redux/workplacesSlice';

export const store = configureStore({
  reducer: {
    authUser: userReducer,
    workplaces: workplacesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
