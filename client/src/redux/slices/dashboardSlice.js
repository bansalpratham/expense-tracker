import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    totalSpending: 0,

    monthly: {
        budget: 0,
        spending: 0,
        remaining: 0
    },

    weekly: {
        budget: 0,
        spending: 0,
        remaining: 0
    },

    categorySpending: []
}

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {

  }
})

export default dashboardSlice.reducer