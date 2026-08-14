import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  expenses: []
}

const expenseSlice = createSlice({
  name: "expense",

  initialState,

  reducers: {

  }
})

export default expenseSlice.reducer