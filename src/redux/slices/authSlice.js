import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FormData from 'form-data';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    isLoggedIn: false,
    username: null,
    accessToken: null,
    profilePic: null,
    loginMessage: null,
    signupMessage: null,
}

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setSignIn: (state, action) => {
            state.isLoggedIn = true;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
            if (action.payload.profilePic)
                state.profilePic = action.payload.profilePic;
        },
        setSignOut: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.accessToken = null;
            state.profilePic = null;
            state.loginMessage = null;
            state.signupMessage = null;
        },
        setProfilePic: (state, action) => {
            state.profilePic = action.payload.profilePic;
        },
        setLoginMessage: (state, action) => {
            state.loginMessage = action.payload.message;
        },
        setSignupMessage: (state, action) => {
            state.signupMessage = action.payload.message;
        }
    }
})

export const { setSignIn, setSignOut, setProfilePic, setLoginMessage, setSignupMessage } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectUsername = (state) => state.userAuth.username;
export const selectAccessToken = (state) => state.userAuth.accessToken;
export const selectProfilePic = (state) => state.userAuth.profilePic;
export const selectLoginMessage = (state) => state.userAuth.loginMessage;
export const selectSignupMessage = (state) => state.userAuth.signupMessage;

export default authSlice.reducer;

export function login(user) {
    return async function loginThunk(dispatch, getState) {
        axios.post('https://trywhistle.app/api/auth/signin', {
            "username": user.username,
            "password": user.password
        })
        .then(resp => {
            dispatch(setSignIn(resp.data));
        })
        .catch(err => {
            dispatch(setLoginMessage(err.response.data));
        })
    }
}

export function signup(user) {
    return async function signupThunk(dispatch, getState) {
        axios.post('https://trywhistle.app/api/auth/signup', {
            "username": user.username,
            "password": user.password
        })
        .then(resp => {
            const loginThunk = login(user)
            dispatch(loginThunk)
        })
        .catch(err => {
            dispatch(setSignupMessage(err.response.data))
        })
    }
}

export function updateProfilePic(accessToken, newProfilePicUri) {
    return async function updateProfilePicThunk(dispatch, getState) {
        const formData = new FormData();
        formData.append("image", {
            name: 'image',
            type: 'image/png',
            uri: newProfilePicUri
        })
        axios({
            method: 'post',
            url: 'https://trywhistle.app/api/user/updateprofilepic',
            data: formData,
            headers: {
                "x-access-token": accessToken
            }
        })
        .then(resp => {
            dispatch(setProfilePic(resp.data));
        })
        .catch(err => {
            console.log(err.response.data);
        })
    }
}