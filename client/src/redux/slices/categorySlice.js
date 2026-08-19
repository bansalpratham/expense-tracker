import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
    categories: [],
    categorySpending: []
}

export const getCategories = createAsyncThunk(
    "category/getCategories",

    async () => {
        const response = await api.get("/getCategory")

        return response.data
    }
)

export const addCategory = createAsyncThunk(
    "category/addCategory",

    async (categoryName) => {
        const response = await api.post("/addCategory", {
            categoryName
        })

        return response.data
    }
)

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",

    async (categoryId) => {
        const response = await api.delete(
            `/deleteCategory/${categoryId}`
        )

        return response.data
    }
)

export const getCategorySpending = createAsyncThunk(
    "category/getCategorySpending",

    async () => {
        const response = await api.get("/getCategorySpending")

        return response.data
    }
)

const categorySlice = createSlice({
    name: "category",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload
            })

            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload)
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    category => category.id !== action.payload.id
                )
            })

            .addCase(getCategorySpending.fulfilled, (state, action) => {
                state.categorySpending = action.payload
            })

    }
})

export default categorySlice.reducer