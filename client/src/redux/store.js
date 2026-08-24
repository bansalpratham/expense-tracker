import { configureStore } from "@reduxjs/toolkit"

import categoryReducer from "./slices/categorySlice"
import expenseReducer from "./slices/expenseSlice"
import budgetReducer from "./slices/budgetSlice"
import dashboardReducer from "./slices/dashboardSlice"
import authReducer from "./slices/authSlice"

export const store = configureStore({

  reducer: {

    auth: authReducer,

    category: categoryReducer,

    expense: expenseReducer,

    budget: budgetReducer,

    dashboard: dashboardReducer,

  }

})