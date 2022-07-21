import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FormData from 'form-data';
import axiosRetry from 'axios-retry';
import OneSignal from 'react-native-onesignal';
import { useDispatch } from "react-redux";
import { resetPublish } from "./publishSlice";

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
            state.loginMessage = null;
            state.signupMessage = null;
        },
        setSignOut: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.accessToken = null;
            state.profilePic = null;
            state.loginMessage = null;
            state.signupMessage = null;
            // Remove External User Id with Callback Available in SDK Version 3.7.0+
            OneSignal.removeExternalUserId((results) => {
                // The results will contain push and email success statuses
                console.log('Results of removing external user id');
                console.log(results);
                // Push can be expected in almost every situation with a success status, but
                // as a pre-caution its good to verify it exists
                if (results.push && results.push.success) {
                console.log('Results of removing external user id push status:');
                console.log(results.push.success);
                }
                
                // Verify the email is set or check that the results have an email success status
                if (results.email && results.email.success) {
                console.log('Results of removoing external user id email status:');
                console.log(results.email.success);
                }
            });
            
            //Available in SDK Version 3.6.5-
            //OneSignal.removeExternalUserId()
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
            OneSignal.setExternalUserId(resp.data.username, (results) => {
                // The results will contain push and email success statuses
                console.log('Results of setting external user id');
                console.log(results);
                
                // Push can be expected in almost every situation with a success status, but
                // as a pre-caution its good to verify it exists
                if (results.push && results.push.success) {
                    console.log('Results of setting external user id push status:');
                    console.log(results.push.success);
                }
                
                // Verify the email is set or check that the results have an email success status
                if (results.email && results.email.success) {
                    console.log('Results of setting external user id email status:');
                    console.log(results.email.success);
                }

                // Verify the number is set or check that the results have an sms success status
                if (results.sms && results.sms.success) {
                    console.log('Results of setting external user id sms status:');
                    console.log(results.sms.success);
                }
            });
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
        console.log("formData: ", formData)
        axios({
            method: 'post',
            url: 'https://trywhistle.app/api/user/updateprofilepic',
            data: formData,
            headers: {
                "x-access-token": accessToken,
                "Content-Type": 'multipart/form-data',
                Accept: 'application/json'
            }
        })
        .then(resp => {
            console.log("successful response")
            console.log(resp.config.data["_parts"])
            // dispatch(setProfilePic(resp.data));
        })
        .catch(err => {
            console.log(err.response.data);
        })
    }
}