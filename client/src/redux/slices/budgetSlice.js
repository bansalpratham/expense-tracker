import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  weekly: 0,
  monthly: 0
}

const budgetSlice = createSlice({
  name: "budget",

  initialState,

  reducers: {

  }
})

export default budgetSlice.reducer