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

    updateError: null,

    passwordLoading: false,

    passwordError: null,

    passwordSuccess: false,

    deleteLoading: false,

    deleteError: null

}


/*
==================================================
GET CURRENT USER
==================================================
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
==================================================
UPDATE CURRENT USER
==================================================
*/

export const updateCurrentUser = createAsyncThunk(

    "auth/updateCurrentUser",

    async (
        { username, email },
        { rejectWithValue }
    ) => {

        try {

            const response = await api.put(
                "/users/me",
                {
                    username,
                    email
                }
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
==================================================
CHANGE PASSWORD
==================================================
*/

export const changePassword = createAsyncThunk(

    "auth/changePassword",

    async (
        {
            currentPassword,
            newPassword
        },
        { rejectWithValue }
    ) => {

        try {

            const response = await api.put(
                "/users/me/password",
                {
                    currentPassword,
                    newPassword
                }
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data ||
                "Failed to change password"
            )

        }

    }

)


/*
==================================================
DELETE ACCOUNT
==================================================
*/

export const deleteAccount = createAsyncThunk(

    "auth/deleteAccount",

    async (_, { rejectWithValue }) => {

        try {

            const response = await api.delete(
                "/users/me"
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data ||
                "Failed to delete account"
            )

        }

    }

)


/*
==================================================
SLICE
==================================================
*/

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {

            state.user = null

            state.error = null

            state.updateError = null

            state.passwordError = null

            state.deleteError = null

            state.passwordSuccess = false

            localStorage.removeItem("token")

        },

        clearPasswordState: (state) => {

            state.passwordError = null

            state.passwordSuccess = false

        }

    },


    extraReducers: (builder) => {

        builder


            /*
            ======================================
            GET CURRENT USER
            ======================================
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

                }
            )


            .addCase(
                getCurrentUser.rejected,
                (state, action) => {

                    state.loading = false

                    state.error = action.payload

                }
            )


            /*
            ======================================
            UPDATE PROFILE
            ======================================
            */

            .addCase(
                updateCurrentUser.pending,
                (state) => {

                    state.updateLoading = true

                    state.updateError = null

                }
            )


            .addCase(
                updateCurrentUser.fulfilled,
                (state, action) => {

                    state.updateLoading = false

                    state.user = action.payload

                    state.updateError = null

                }
            )


            .addCase(
                updateCurrentUser.rejected,
                (state, action) => {

                    state.updateLoading = false

                    state.updateError = action.payload

                }
            )


            /*
            ======================================
            CHANGE PASSWORD
            ======================================
            */

            .addCase(
                changePassword.pending,
                (state) => {

                    state.passwordLoading = true

                    state.passwordError = null

                    state.passwordSuccess = false

                }
            )


            .addCase(
                changePassword.fulfilled,
                (state) => {

                    state.passwordLoading = false

                    state.passwordError = null

                    state.passwordSuccess = true

                }
            )


            .addCase(
                changePassword.rejected,
                (state, action) => {

                    state.passwordLoading = false

                    state.passwordError = action.payload

                    state.passwordSuccess = false

                }
            )


            /*
            ======================================
            DELETE ACCOUNT
            ======================================
            */

            .addCase(
                deleteAccount.pending,
                (state) => {

                    state.deleteLoading = true

                    state.deleteError = null

                }
            )


            .addCase(
                deleteAccount.fulfilled,
                (state) => {

                    state.deleteLoading = false

                    state.user = null

                    state.deleteError = null

                    localStorage.removeItem("token")

                }
            )


            .addCase(
                deleteAccount.rejected,
                (state, action) => {

                    state.deleteLoading = false

                    state.deleteError = action.payload

                }
            )

    }

})


export const {
    logout,
    clearPasswordState
} = authSlice.actions


export default authSlice.reducer