import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    followers: [],
    following: []
};

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
        },
        resetUserInfo: (state) => {
            state.followers = [];
            state.following = [];
        }
    }
});

export const { setFollowers, setFollowing, resetUserInfo } = userSlice.actions;

export const selectFollowers = (state) => state.userInfo.followers;
export const selectFollowing = (state) => state.userInfo.following;

export default userSlice.reducer;