import {
    Action,
    ThunkAction,
    combineReducers,
    configureStore,
} from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import createWebStorage from 'redux-persist/es/storage/createWebStorage';

import authSlice, { setAuth, setToken, setUser } from './slices/auth-slice';


import { authApi } from '@/services/auth-api';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';

const storage = createWebStorage('local');

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const appReducer = combineReducers({
  auth: authSlice,

 
//   [collectionApi.reducerPath]: collectionApi.reducer,

});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined; // Reset whole state
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const hydrateAuthFromStorage = () => {
  try {
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (rawUser && token) {
      const user = JSON.parse(rawUser);
      store.dispatch(setUser(user));
      store.dispatch(setToken({ accessToken: token }));
      store.dispatch(setAuth(true));
    }
  } catch (error) {
    // Ignore malformed storage and let user log in again.
  }
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
   
    
    
      .concat(authApi.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
hydrateAuthFromStorage();

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, IRootState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
