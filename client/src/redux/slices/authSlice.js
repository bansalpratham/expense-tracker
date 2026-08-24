import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit"

import api from "../../services/api"


const initialState = {

    user: null,

    loading: false,

    error: null,

    updateLoading: false,

    updateError: null

}


/*
========================================
GET CURRENT USER
========================================
*/

export const getCurrentUser = createAsyncThunk(

    "auth/getCurrentUser",

    async (_, { rejectWithValue }) => {

        try {

            const response = await api.get(
                "/users/me"
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data ||
                "Failed to fetch user"
            )

        }

    }

)


/*
========================================
UPDATE CURRENT USER
========================================
*/

export const updateCurrentUser = createAsyncThunk(

    "auth/updateCurrentUser",

    async (
        userData,
        { rejectWithValue }
    ) => {

        try {

            const response = await api.put(
                "/users/me",
                userData
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data ||
                "Failed to update profile"
            )

        }

    }

)


/*
========================================
AUTH SLICE
========================================
*/

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {

            state.user = null

            state.loading = false

            state.error = null

            state.updateLoading = false

            state.updateError = null

            localStorage.removeItem("token")

        }

    },

    extraReducers: (builder) => {

        builder


            /*
            ================================
            GET CURRENT USER
            ================================
            */

            .addCase(
                getCurrentUser.pending,
                (state) => {

                    state.loading = true

                    state.error = null

                }
            )


            .addCase(
                getCurrentUser.fulfilled,
                (state, action) => {

                    state.loading = false

                    state.user = action.payload

                    state.error = null

                }
            )


            .addCase(
                getCurrentUser.rejected,
                (state, action) => {

                    state.loading = false

                    state.user = null

                    state.error = action.payload

                }
            )


            /*
            ================================
            UPDATE PROFILE - PENDING
            ================================
            */

            .addCase(
                updateCurrentUser.pending,
                (state) => {

                    state.updateLoading = true

                    state.updateError = null

                }
            )


            /*
            ================================
            UPDATE PROFILE - SUCCESS
            ================================
            */

            .addCase(
                updateCurrentUser.fulfilled,
                (state, action) => {

                    state.updateLoading = false

                    state.user = action.payload

                    state.updateError = null

                }
            )


            /*
            ================================
            UPDATE PROFILE - ERROR
            ================================
            */

            .addCase(
                updateCurrentUser.rejected,
                (state, action) => {

                    state.updateLoading = false

                    state.updateError = action.payload

                }
            )

    }

})


export const {
    logout
} = authSlice.actions


export default authSlice.reducer