import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    phoneNumber: null,
    username: null
}

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setSignIn: (state, action) => {
            state.phoneNumber = action.payload.phoneNumber;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.username = action.payload.username;
        },
        setSignOut: (state) => {
            state.phoneNumber = null;
            state.username = null;
            state.isLoggedIn = false;
        }
    }
});

export const { setSignIn, setSignOut } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectPhoneNumber = (state) => state.userAuth.phoneNumber;
export const selectUsername = (state) => state.userAuth.username;

export default authSlice.reducer;