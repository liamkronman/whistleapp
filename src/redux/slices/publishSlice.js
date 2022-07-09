import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    title: null,
    background: null,
    context: null,
    choices: null,
    expirationDateTime: null
};

const publishSlice = createSlice({
    name: 'whistleDraft',
    initialState,
    reducers: {
        setTitleAndBackground: (state, action) => {
            state.title = action.payload.title;
            state.background = action.payload.title;
        },
        setContext: (state, action) => {
            state.context = action.payload.title;
        },
        setChoices: (state, action) => {
            state.choices = action.payload.choices;
        },
        setExpirationDateTime: (state, action) => {
            state.expirationDateTime = action.payload.expirationDateTime;
        }
    }
});

export const { setTitleAndBackground, setContext, setChoices, setExpirationDateTime } = authSlice.actions;

export const selectTitle = (state) => state.whistleDraft.title;
export const selectBackground = (state) => state.whistleDraft.background;
export const selectContext = (state) => state.whistleDraft.context;
export const selectChoices = (state) => state.whistleDraft.choices;
export const selectExpirationDateTime = (state) => state.whistleDraft.expirationDateTime;