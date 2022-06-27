import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoggedIn: false,
    phoneNumber: null,
    username: null,
    accessToken: null,
    loginMessage: null,
}

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setSignIn: (state, action) => {
            state.isLoggedIn = true;
            state.phoneNumber = action.payload.phoneNumber;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
        },
        setSignOut: (state) => {
            state.isLoggedIn = false;
            state.phoneNumber = null;
            state.username = null;
            state.accessToken = null;
            state.loginMessage = null;
        },
        setLoginMessage: (state, action) => {
            state.loginMessage = action.payload.message;
        },
        setSignupMessage: (state, action) => {
            state.signupMessage = action.payload.message;
        }
    }
});

export const { setSignIn, setSignOut, setMessage } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectPhoneNumber = (state) => state.userAuth.phoneNumber;
export const selectUsername = (state) => state.userAuth.username;
export const selectAccessToken = (state) => state.userAuth.accessToken;
export const selectMessage = (state) => state.userAuth.message;

export default authSlice.reducer;

export function login(user) {
    return async function loginThunk(dispatch, getState) {
        const resp = await axios.post('https://trywhistle.app/api/auth/signin', {
            username: user.username,
            password: user.password,
        })
        .then(() => {
            dispatch(setSignIn(resp.data));
        })
        .catch(err => {
            dispatch(setLoginMessage(err.response.data));
        })
    }
}

export function signup(user) {
    return async function signupThunk(dispatch, getState) {
        const resp = await axios.post('https://trywhistle.app/api/auth/signup', {
            username: user.username,
            phoneNumber: user.phoneNumber,
            password: user.password
        })
        .then(() => {
            const loginThunk = login(user)
            dispatch(loginThunk)
        })
        .catch(err => {
            dipatch(setSignupMessage("Something went wrong. Try again."))
        })
    }
}