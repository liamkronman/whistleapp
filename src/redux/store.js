import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import publishSlice from './slices/publishSlice';
import userSlice from './slices/userSlice';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage.clear();

const reducers = combineReducers({
    userAuth: authSlice,
    whistleDraft: publishSlice,
    userInfo: userSlice
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }),
    enhancers: [composedEnhancer],
})