import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    anonymous: false,
    title: null,
    background: null,
    context: null,
    choices: null,
    expirationDateTime: null,
    errorMessage: null,
    isSuccessful: false
};

const publishSlice = createSlice({
    name: 'whistleDraft',
    initialState,
    reducers: {
        setTitleAndBackground: (state, action) => {
            state.anonymous = action.payload.anonymous;
            state.title = action.payload.title;
            state.background = action.payload.background;
        },
        setContext: (state, action) => {
            state.context = action.payload.context;
        },
        setChoices: (state, action) => {
            state.choices = action.payload.choices;
        },
        setExpirationDateTime: (state, action) => {
            state.expirationDateTime = action.payload.expirationDateTime;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload.error;
        },
        clearWhistle: (state) => {
            state.isSuccessful = true;
            state.title = null;
            state.background = null;
            state.context = null;
            state.choices = null;
            state.expirationDateTime = null;
            state.errorMessage = null;
        },
        resetIsSuccessful: (state) => {
            state.isSuccessful = false;
        }
    }
});

export const { setTitleAndBackground, setContext, setChoices, setExpirationDateTime, clearWhistle, setErrorMessage, resetIsSuccessful } = publishSlice.actions;

export const selectAnonymous = (state) => state.whistleDraft.anonymous;
export const selectTitle = (state) => state.whistleDraft.title;
export const selectBackground = (state) => state.whistleDraft.background;
export const selectContext = (state) => state.whistleDraft.context;
export const selectChoices = (state) => state.whistleDraft.choices;
export const selectExpirationDateTime = (state) => state.whistleDraft.expirationDateTime;
export const selectErrorMessage = (state) => state.whistleDraft.errorMessage;
export const selectIsSuccessful = (state) => state.whistleDraft.isSuccessful;

export default publishSlice.reducer;

export async function blowWhistleThunk(dispatch, getState) {
    const state = getState();
    const choices = state.whistleDraft.choices;
    let options = {}
    
    for (let i = 0; i < choices.length; i++) {
        options[choices[i]] = 0;
    }

    axios.post("https://trywhistle.app/api/app/makewhistle", 
        {
            "anonymous": state.whistleDraft.anonymous,
            "title": state.whistleDraft.title,
            "background": state.whistleDraft.background,
            "context": state.whistleDraft.context,
            "options": options,
            "closeDateTime": state.whistleDraft.expirationDateTime,
        },
        {
            headers: {
                "x-access-token": state.userAuth.accessToken
            }
        }
    )
    .then(resp => {
        dispatch(clearWhistle());
    })
    .catch(err => {
        console.log(err);
        dispatch(setErrorMessage(err.response.data));
    });
}