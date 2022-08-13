import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const initialState = {
    username: null,
    followers: [],
    following: []
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
            console.log(`followers: ${state.followers}`)
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
            console.log(`following: ${state.following}`)
        },
        resetUserInfo: (state) => {
            state.followers = [];
            state.following = [];
        }
    }
});

export const { setUsername, setFollowers, setFollowing, resetUserInfo } = userSlice.actions;

export const selectFollowers = (state) => state.userInfo.followers;
export const selectFollowing = (state) => state.userInfo.following;

export default userSlice.reducer;

export async function setFollowerFollowing(dispatch, getState) {
    const state = getState();
    console.log(state);
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