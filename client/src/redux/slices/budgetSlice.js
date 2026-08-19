import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
    weekly: 0,
    monthly: 0
}

export const addBudget = createAsyncThunk(
    "budget/addBudget",

    async ({ amount, type }) => {

        const response = await api.post("/addBudget", {
            amount,
            type
        })

        return response.data
    }
)

export const getBudget = createAsyncThunk(
    "budget/getBudget",

    async () => {

        const response = await api.get("/getBudget")

        return response.data
    }
)

export const deleteBudget = createAsyncThunk(
    "budget/deleteBudget",

    async (budgetId) => {

        const response = await api.delete(
            `/deleteBudget/${budgetId}`
        )

        return response.data
    }
)

export const updateBudget = createAsyncThunk(
    "budget/updateBudget",

    async ({ budgetId, amount }) => {

        const response = await api.put(
            `/updateBudget/${budgetId}`,
            {
                amount
            }
        )

        return response.data
    }
)

const budgetSlice = createSlice({

    name: "budget",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getBudget.fulfilled, (state, action) => {

                action.payload.forEach(budget => {

                    if (budget.type === "weekly") {
                        state.weekly = budget
                    }

                    if (budget.type === "monthly") {
                        state.monthly = budget
                    }

                })

            })

            
            .addCase(addBudget.fulfilled, (state, action) => {

                if (action.payload.type === "weekly") {
                    state.weekly = action.payload
                }

                if (action.payload.type === "monthly") {
                    state.monthly = action.payload
                }

            })

            .addCase(deleteBudget.fulfilled, (state, action) => {

                if (action.payload.type === "weekly") {
                    state.weekly = 0
                }

                if (action.payload.type === "monthly") {
                    state.monthly = 0
                }

            })

            .addCase(updateBudget.fulfilled, (state, action) => {

                if (action.payload.type === "weekly") {
                    state.weekly = action.payload
                }

                if (action.payload.type === "monthly") {
                    state.monthly = action.payload
                }

            })
    }
})

export default budgetSlice.reducer