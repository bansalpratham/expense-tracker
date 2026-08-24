import { configureStore } from "@reduxjs/toolkit"

import categoryReducer from "./slices/categorySlice"
import expenseReducer from "./slices/expenseSlice"
import budgetReducer from "./slices/budgetSlice"
import dashboardReducer from "./slices/dashboardSlice"
import authReducer from "./slices/authSlice"
import notificationReducer from "./slices/notificationSlice"

export const store = configureStore({

  reducer: {

    auth: authReducer,

    notification: notificationReducer,

    category: categoryReducer,

    expense: expenseReducer,

    budget: budgetReducer,

    dashboard: dashboardReducer,

  }

})