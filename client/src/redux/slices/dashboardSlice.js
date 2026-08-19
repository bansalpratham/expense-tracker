import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
    totalSpending: 0,

    monthly: {
        budget: 0,
        spending: 0,
        remaining: 0
    },

    weekly: {
        budget: 0,
        spending: 0,
        remaining: 0
    },

    categorySpending: []
}


export const getDashboard = createAsyncThunk(
    "dashboard/getDashboard",

    async () => {
        const response = await api.get("/dashboard")

        return response.data
    }
)


const dashboardSlice = createSlice({

    name: "dashboard",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(getDashboard.fulfilled, (state, action) => {

            state.totalSpending = action.payload.totalSpending

            state.monthly = action.payload.monthly

            state.weekly = action.payload.weekly

        })

    }

})


export default dashboardSlice.reducer