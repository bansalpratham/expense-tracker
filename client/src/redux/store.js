import { configureStore } from "@reduxjs/toolkit"

import categoryReducer from "./slices/categorySlice"
import expenseReducer from "./slices/expenseSlice"
import budgetReducer from "./slices/budgetSlice"


export const store = configureStore({

  reducer: {

    category: categoryReducer,

    expense: expenseReducer,

    budget: budgetReducer

  }

})