import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"


const initialState = {
    weekly: null,
    monthly: null,

    loading: false,
    error: null
}


/*
========================================
ADD BUDGET
========================================
*/

export const addBudget = createAsyncThunk(
    "budget/addBudget",

    async ({ amount, type }, { rejectWithValue }) => {

        try {

            const response = await api.post(
                "/addBudget",
                {
                    amount,
                    type
                }
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data ||
                "Failed to add budget"
            )

        }
    }
)


/*
========================================
GET BUDGET
========================================
*/

export const getBudget = createAsyncThunk(
    "budget/getBudget",

    async (_, { rejectWithValue }) => {

        try {

            const response = await api.get(
                "/getBudget"
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data ||
                "Failed to get budgets"
            )

        }
    }
)


/*
========================================
DELETE BUDGET
========================================
*/

export const deleteBudget = createAsyncThunk(
    "budget/deleteBudget",

    async (budgetId, { rejectWithValue }) => {

        try {

            const response = await api.delete(
                `/deleteBudget/${budgetId}`
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data ||
                "Failed to delete budget"
            )

        }
    }
)


/*
========================================
UPDATE BUDGET
========================================
*/

export const updateBudget = createAsyncThunk(
    "budget/updateBudget",

    async ({ budgetId, amount }, { rejectWithValue }) => {

        try {

            const response = await api.put(
                `/updateBudget/${budgetId}`,
                {
                    amount
                }
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data ||
                "Failed to update budget"
            )

        }
    }
)


/*
========================================
SLICE
========================================
*/

const budgetSlice = createSlice({

    name: "budget",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder


            /*
            ================================
            GET BUDGET
            ================================
            */

            .addCase(
                getBudget.pending,
                (state) => {

                    state.loading = true
                    state.error = null

                }
            )

            .addCase(
                getBudget.fulfilled,
                (state, action) => {

                    state.loading = false

                    // Reset first
                    state.weekly = null
                    state.monthly = null


                    action.payload.forEach(
                        (budget) => {

                            if (
                                budget.type === "weekly"
                            ) {

                                state.weekly = budget

                            }

                            if (
                                budget.type === "monthly"
                            ) {

                                state.monthly = budget

                            }

                        }
                    )

                }
            )

            .addCase(
                getBudget.rejected,
                (state, action) => {

                    state.loading = false

                    state.error =
                        action.payload

                }
            )


            /*
            ================================
            ADD BUDGET
            ================================
            */

            .addCase(
                addBudget.fulfilled,
                (state, action) => {

                    state.error = null

                    if (
                        action.payload.type ===
                        "weekly"
                    ) {

                        state.weekly =
                            action.payload

                    }

                    if (
                        action.payload.type ===
                        "monthly"
                    ) {

                        state.monthly =
                            action.payload

                    }

                }
            )

            .addCase(
                addBudget.rejected,
                (state, action) => {

                    state.error =
                        action.payload

                }
            )


            /*
            ================================
            UPDATE BUDGET
            ================================
            */

            .addCase(
                updateBudget.fulfilled,
                (state, action) => {

                    state.error = null

                    if (
                        action.payload.type ===
                        "weekly"
                    ) {

                        state.weekly =
                            action.payload

                    }

                    if (
                        action.payload.type ===
                        "monthly"
                    ) {

                        state.monthly =
                            action.payload

                    }

                }
            )

            .addCase(
                updateBudget.rejected,
                (state, action) => {

                    state.error =
                        action.payload

                }
            )


            /*
            ================================
            DELETE BUDGET
            ================================
            */

            .addCase(
                deleteBudget.fulfilled,
                (state, action) => {

                    state.error = null

                    if (
                        action.payload.type ===
                        "weekly"
                    ) {

                        state.weekly = null

                    }

                    if (
                        action.payload.type ===
                        "monthly"
                    ) {

                        state.monthly = null

                    }

                }
            )

            .addCase(
                deleteBudget.rejected,
                (state, action) => {

                    state.error =
                        action.payload

                }
            )

    }

})


export default budgetSlice.reducer