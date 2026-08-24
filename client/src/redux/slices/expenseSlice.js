import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../services/api"


const initialState = {

    expenses: [],

    allExpenses: [],

    loading: false,

    error: null

}


/*
====================================================
GET ALL EXPENSES
====================================================
*/

export const getExpenses = createAsyncThunk(
    "expense/getExpenses",

    async () => {

        const response = await api.get("/getExpense")

        return response.data

    }
)


/*
====================================================
ADD EXPENSE
====================================================
*/

export const addExpense = createAsyncThunk(
    "expense/addExpense",

    async ({
        amount,
        description,
        date,
        categoryId
    }) => {

        const response = await api.post(
            "/addExpense",
            {
                amount,
                description,
                date,
                categoryId
            }
        )

        return response.data

    }
)


/*
====================================================
DELETE EXPENSE
====================================================
*/

export const deleteExpense = createAsyncThunk(
    "expense/deleteExpense",

    async (expenseId) => {

        const response = await api.delete(
            `/deleteExpense/${expenseId}`
        )

        return response.data

    }
)


/*
====================================================
GET EXPENSES BY DATE
====================================================
*/

export const getExpensesByDate = createAsyncThunk(
    "expense/getExpensesByDate",

    async ({
        startDate,
        endDate
    }) => {

        const response = await api.get(
            `/getExpenseByDate?startDate=${startDate}&endDate=${endDate}`
        )

        return response.data

    }
)


/*
====================================================
GET DASHBOARD
====================================================
*/

export const getDashboard = createAsyncThunk(
    "expense/getDashboard",

    async () => {

        const response = await api.get("/dashboard")

        return response.data

    }
)


/*
====================================================
SLICE
====================================================
*/

const expenseSlice = createSlice({

    name: "expense",

    initialState,

    reducers: {

        /*
        ================================================
        CLEAR DATE FILTER
        ================================================
        */

        clearExpenseFilter: (state) => {

            state.expenses = state.allExpenses

        }

    },


    extraReducers: (builder) => {

        /*
        ================================================
        GET EXPENSES
        ================================================
        */

        builder.addCase(
            getExpenses.pending,
            (state) => {

                state.loading = true

                state.error = null

            }
        )


        builder.addCase(
            getExpenses.fulfilled,
            (state, action) => {

                state.loading = false

                state.allExpenses = action.payload

                state.expenses = action.payload

            }
        )


        builder.addCase(
            getExpenses.rejected,
            (state, action) => {

                state.loading = false

                state.error =
                    action.error.message

            }
        )


        /*
        ================================================
        ADD EXPENSE
        ================================================
        */

        builder.addCase(
            addExpense.fulfilled,
            (state, action) => {

                state.allExpenses.push(
                    action.payload
                )

                state.expenses.push(
                    action.payload
                )

            }
        )


        /*
        ================================================
        DELETE EXPENSE
        ================================================
        */

        builder.addCase(
            deleteExpense.fulfilled,
            (state, action) => {

                state.allExpenses =
                    state.allExpenses.filter(
                        expense =>
                            expense.id !==
                            action.payload.id
                    )


                state.expenses =
                    state.expenses.filter(
                        expense =>
                            expense.id !==
                            action.payload.id
                    )

            }
        )


        /*
        ================================================
        DATE FILTER
        ================================================
        */

        builder.addCase(
            getExpensesByDate.fulfilled,
            (state, action) => {

                state.expenses = action.payload

            }
        )

    }

})


export const {
    clearExpenseFilter
} = expenseSlice.actions


export default expenseSlice.reducer