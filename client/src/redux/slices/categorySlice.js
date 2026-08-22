import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"

const initialState = {
    categories: [],
    categorySpending: [],
    loading: false,
    adding: false,
    deletingId: null,
    error: null
}

export const getCategories = createAsyncThunk(
    "category/getCategories",

    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/getCategory")

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load categories"
            )
        }
    }
)

export const addCategory = createAsyncThunk(
    "category/addCategory",

    async (categoryName, { rejectWithValue }) => {
        try {
            const response = await api.post("/addCategory", {
                categoryName
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to add category"
            )
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",

    async (categoryId, { rejectWithValue }) => {
        try {
            await api.delete(`/deleteCategory/${categoryId}`)

            // Your backend currently doesn't return the deleted row.
            // So return the ID ourselves.
            return categoryId
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to delete category"
            )
        }
    }
)

export const getCategorySpending = createAsyncThunk(
    "category/getCategorySpending",

    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/getCategorySpending")

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load category spending"
            )
        }
    }
)

const categorySlice = createSlice({

    name: "category",

    initialState,

    reducers: {
        clearCategoryError: (state) => {
            state.error = null
        }
    },

    extraReducers: (builder) => {

        builder

            // GET CATEGORIES
            .addCase(getCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload
            })

            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })


            // ADD CATEGORY
            .addCase(addCategory.pending, (state) => {
                state.adding = true
                state.error = null
            })

            .addCase(addCategory.fulfilled, (state, action) => {
                state.adding = false

                state.categories.push(action.payload)
            })

            .addCase(addCategory.rejected, (state, action) => {
                state.adding = false
                state.error = action.payload
            })


            // DELETE CATEGORY
            .addCase(deleteCategory.pending, (state, action) => {
                state.deletingId = action.meta.arg
                state.error = null
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.deletingId = null

                state.categories = state.categories.filter(
                    category => category.id !== action.payload
                )

                state.categorySpending = state.categorySpending.filter(
                    category => category.id !== action.payload
                )
            })

            .addCase(deleteCategory.rejected, (state, action) => {
                state.deletingId = null
                state.error = action.payload
            })


            // CATEGORY SPENDING
            .addCase(getCategorySpending.fulfilled, (state, action) => {
                state.categorySpending = action.payload
            })

            .addCase(getCategorySpending.rejected, (state, action) => {
                state.error = action.payload
            })
    }
})

export const {
    clearCategoryError
} = categorySlice.actions

export default categorySlice.reducer