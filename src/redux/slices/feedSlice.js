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