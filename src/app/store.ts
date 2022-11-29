import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import maengelmelderReducer from '../features/maengelmelder/maengelmelderSlice';


// load previous redux states from browser if exists
const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState') ?? '')
  : {};

// create the store
export const store = configureStore({
  preloadedState: persistedState,
  reducer: {
    maengelmelder: maengelmelderReducer,
  },
});

// store the redux state on browser
store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
