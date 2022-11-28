import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import maengelmelderReducer from '../features/maengelmelder/maengelmelderSlice';

export const store = configureStore({
  reducer: {
    maengelmelder: maengelmelderReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
