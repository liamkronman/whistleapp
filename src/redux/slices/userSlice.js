import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    username: null,
    followers: [],
    following: [],
    isFollowing: false,
};

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
        },
        setIsFollowing: (state, action) => {
            state.isFollowing = action.payload;
        },
        resetUserInfo: (state) => {
            state.username = null;
            state.followers = [];
            state.following = [];
            state.isFollowing = false;
        }
    }
});

export const { setUsername, setFollowers, setFollowing, setIsFollowing, resetUserInfo } = userSlice.actions;

export const selectFollowers = (state) => state.userInfo.followers;
export const selectFollowing = (state) => state.userInfo.following;
export const selectUsername = (state) => state.userInfo.username;
export const selectIsFollowing = (state) => state.userInfo.isFollowing;

export default userSlice.reducer;

export async function checkIsFollowing (dispatch, getState) {
    const state = getState();
    axios.post("https://trywhistle.app/api/user/checkisfollowing", {
        targetUsername: state.userInfo.username
    }, {
        headers: {
            "x-access-token": state.userAuth.accessToken
        }
    })
    .then(resp => {
        dispatch(setIsFollowing(resp.data.isFollowing));
    })
    .catch(err => {
        console.log(err);
    });
}

export async function setFollowerFollowing(dispatch, getState) {
    const state = getState();
    axios.post("https://trywhistle.app/api/user/getuserfollowerfollowing", {
        "username": state.userInfo.username
    }, {
        headers: {
            "x-access-token": state.userAuth.accessToken
        }
    })
    .then(resp => {
        const newFollowers = resp.data.followers;
        const newFollowing = resp.data.following;
        dispatch(resetUserInfo());
        dispatch(setFollowers(newFollowers));
        dispatch(setFollowing(newFollowing));
    })
    .catch(err => {
        console.log(err);
    });
}