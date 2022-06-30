import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    whistles: [],
    currentWhistle: null,
};

const feedSlice = createSlice({
    name: "userFeed",
    initialState,
    reducers: {
        setWhistles: (state, action) => {
            state.whistles = action.payload.whistles;
        },
        setCurrentWhistle: (state, action) => {
            state.currentWhistle = action.payload.whistleId;
        },
        addWhistles: (state, action) => {
            state.whistles.push(action.payload.whistles);
        },
        removeWhistle: (state, action) => {
            state.whistles = state.whistles.filter(
                (whistle) => whistle.id !== action.payload.whistleId
            );
        }
    }
});

export const { setWhistles, setCurrentWhistle, addWhistles, removeWhistle } = feedSlice.actions;

export const selectWhistles = (state) => state.userFeed.whistles;
export const selectCurrentWhistle = (state) => state.userFeed.currentWhistle;

export default feedSlice.reducer;

export function getWhistlesThunk(dispatch, getState) {
    const whistles = getState().userFeed.whistles;
    let lastWhistleId = null;

    if (whistles.length > 0) {
        lastWhistleId = whistles[whistles.length - 1].id;
    }

    axios.get("https://trywhistle.app/api/app/getwhistles", {
        lastId: lastWhistleId,
    }, {
        headers: {
            "x-access-token": getState().userAuth.accessToken,
        }
    })
    .then(resp => {
        console.log(resp)
       dispatch(addWhistles(resp.data));
    })
    .catch(err => {
        console.log(err);
    });
};