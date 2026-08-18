import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
    categories: []
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
    }
})

export default categorySlice.reducer