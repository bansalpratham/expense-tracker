import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Expenses from "./pages/Expenses"
import Categories from "./pages/Categories"
import Budget from "./pages/Budget"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

     <Route
    path="/expenses"
    element={<Expenses />}
/>

<Route
    path="/categories"
    element={<Categories />}
/>

<Route
    path="/budget"
    element={<Budget />}
/>

      </Routes>

    </BrowserRouter>

  )

}

export default App