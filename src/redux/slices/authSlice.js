import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoggedIn: false,
    phoneNumber: null,
    username: null,
    accessToken: null,
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
        },
    }
});

export const { setSignIn, setSignOut } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectPhoneNumber = (state) => state.userAuth.phoneNumber;
export const selectUsername = (state) => state.userAuth.username;

export default authSlice.reducer;

export function login(user) {
    return async function loginThunk(dispatch, getState) {
        const resp = await axios.post('https://trywhistle.app/api/auth/signin', {
            username: user.username,
            password: user.password,
        });
        dispatch(setSignIn(resp.data));
    }
}