import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Expenses from "./pages/Expenses"
import Categories from "./pages/Categories"
import Budget from "./pages/Budget"


/*
=========================================================
PROTECTED ROUTE
=========================================================

If token exists:
    allow user to access the page

If token does not exist:
    send user to Login
*/

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/" replace />
    }

    return children
}


/*
=========================================================
PUBLIC ROUTE
=========================================================

Used for Login and Signup.

If user is already logged in and tries to visit:

    /
    /signup

send them directly to Home.
*/

function PublicRoute({ children }) {

    const token = localStorage.getItem("token")

    if (token) {
        return <Navigate to="/home" replace />
    }

    return children
}


/*
=========================================================
APP
=========================================================
*/

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />


                {/* =================================================
                    SIGNUP
                ================================================= */}

                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />


                {/* =================================================
                    HOME
                ================================================= */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    EXPENSES
                ================================================= */}

                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <Expenses />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CATEGORIES
                ================================================= */}

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    BUDGET
                ================================================= */}

                <Route
                    path="/budget"
                    element={
                        <ProtectedRoute>
                            <Budget />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    UNKNOWN ROUTE
                ================================================= */}

                <Route
                    path="*"
                    element={
                        localStorage.getItem("token")
                            ? <Navigate to="/home" replace />
                            : <Navigate to="/" replace />
                    }
                />

            </Routes>

        </BrowserRouter>

    )

}


export default App