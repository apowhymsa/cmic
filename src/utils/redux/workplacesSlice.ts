import { createSlice } from '@reduxjs/toolkit';

interface IWorkPlace {
  creatorID: string | null;
  workPlaceID: string | null;
  name: string | null;
  members: string[] | null;
}

export const workplacesSlice = createSlice({
  name: 'workplaces',
  initialState: {
    workplaces: [] as IWorkPlace[],
  },
  reducers: {
    setWorkplaces: (state, action) => {
      state.workplaces = action.payload;
    },
  },
});

export const { setWorkplaces } = workplacesSlice.actions;
export default workplacesSlice.reducer;
