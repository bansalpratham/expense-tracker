import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit"

import api from "../../services/api"


/*
========================================
GET NOTIFICATIONS
========================================
*/

export const getNotifications = createAsyncThunk(

    "notification/getNotifications",

    async (_, { rejectWithValue }) => {

        try {

            const response = await api.get(
                "/notifications"
            )

            return response.data

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch notifications"
            )

        }

    }

)


/*
========================================
MARK ONE AS READ
========================================
*/

export const markNotificationAsRead =
    createAsyncThunk(

        "notification/markNotificationAsRead",

        async (
            notificationId,
            { rejectWithValue }
        ) => {

            try {

                const response = await api.patch(
                    `/notifications/${notificationId}/read`
                )

                return response.data

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    "Failed to mark notification as read"
                )

            }

        }

    )


/*
========================================
MARK ALL AS READ
========================================
*/

export const markAllNotificationsAsRead =
    createAsyncThunk(

        "notification/markAllNotificationsAsRead",

        async (_, { rejectWithValue }) => {

            try {

                const response = await api.patch(
                    "/notifications/read-all"
                )

                return response.data

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    "Failed to mark notifications as read"
                )

            }

        }

    )


/*
========================================
DELETE NOTIFICATION
========================================
*/

export const deleteNotification =
    createAsyncThunk(

        "notification/deleteNotification",

        async (
            notificationId,
            { rejectWithValue }
        ) => {

            try {

                await api.delete(
                    `/notifications/${notificationId}`
                )

                return notificationId

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    "Failed to delete notification"
                )

            }

        }

    )


/*
========================================
INITIAL STATE
========================================
*/

const initialState = {

    notifications: [],

    loading: false,

    error: null

}


/*
========================================
SLICE
========================================
*/

const notificationSlice = createSlice({

    name: "notification",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder


            /*
            ================================
            GET NOTIFICATIONS
            ================================
            */

            .addCase(
                getNotifications.pending,
                (state) => {

                    state.loading = true

                    state.error = null

                }
            )


            .addCase(
                getNotifications.fulfilled,
                (state, action) => {

                    state.loading = false

                    state.notifications =
                        action.payload

                }
            )


            .addCase(
                getNotifications.rejected,
                (state, action) => {

                    state.loading = false

                    state.error =
                        action.payload

                }
            )


            /*
            ================================
            MARK ONE READ
            ================================
            */

            .addCase(
                markNotificationAsRead.fulfilled,
                (state, action) => {

                    const updatedNotification =
                        action.payload

                    const notification =
                        state.notifications.find(
                            (item) =>
                                Number(item.id) ===
                                Number(
                                    updatedNotification.id
                                )
                        )

                    if (notification) {

                        notification.is_read = true

                    }

                }
            )


            /*
            ================================
            MARK ALL READ
            ================================
            */

            .addCase(
                markAllNotificationsAsRead.fulfilled,
                (state) => {

                    state.notifications.forEach(
                        (notification) => {

                            notification.is_read = true

                        }
                    )

                }
            )


            /*
            ================================
            DELETE
            ================================
            */

            .addCase(
                deleteNotification.fulfilled,
                (state, action) => {

                    state.notifications =
                        state.notifications.filter(
                            (notification) =>
                                Number(notification.id) !==
                                Number(action.payload)
                        )

                }
            )

    }

})


export default notificationSlice.reducer