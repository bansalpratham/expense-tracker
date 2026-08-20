import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"

const initialState = {
    expenses: []
}

export const getExpenses = createAsyncThunk(
    "expense/getExpenses",

    async () => {
        const response = await api.get("/getExpense")

        return response.data
    }
)

export const addExpense = createAsyncThunk(
    "expense/addExpense",

    async ({ amount, description, date, categoryId }) => {
        const response = await api.post("/addExpense", {
            amount,
            description,
            date,
            categoryId
        })

        return response.data
    }
)

export const deleteExpense = createAsyncThunk(
    "expense/deleteExpense",

    async (expenseId) => {
        const response = await api.delete(
            `/deleteExpense/${expenseId}`
        )

        return response.data
    }
)

export const getExpensesByDate = createAsyncThunk(
    "expense/getExpensesByDate",

    async ({ startDate, endDate }) => {
        const response = await api.get(
            `/getExpenseByDate?startDate=${startDate}&endDate=${endDate}`
        )

        return response.data
    }
)

export const getDashboard = createAsyncThunk(
    "expense/getDashboard",

    async () => {
        const response = await api.get("/dashboard")

        return response.data
    }
)

const expenseSlice = createSlice({
    name: "expense",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload
            })

            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenses.push(action.payload)
            })

            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(
                    expense => expense.id !== action.payload.id
                )
            })

            .addCase(getExpensesByDate.fulfilled, (state, action) => {
                state.expenses = action.payload
            })
    }
})

export default expenseSlice.reducer