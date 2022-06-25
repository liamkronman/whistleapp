import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = configureStore({
    reducer: {
        userAuth: authSlice
    },
    enhancers: [composedEnhancer],
})