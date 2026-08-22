import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    LayoutDashboard,
    Receipt,
    Tag,
    Wallet,
    CircleDollarSign
} from "lucide-react"

import ExpensesPage from "../components/ExpensesPage"
import AddExpenseForm from "../components/AddExpenseForm"


function Expenses() {

    const navigate = useNavigate()

    const [showAddExpense, setShowAddExpense] = useState(false)


    return (

        <div className="expense-route-shell">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="expense-route-sidebar">

                {/* LOGO */}

                <div className="expense-route-logo">

                    <div className="expense-route-logo-icon">

                        <CircleDollarSign size={20} />

                    </div>

                    <span className="expense-route-logo-text">
                        Expense<span>Flow</span>
                    </span>

                </div>


                {/* NAVIGATION */}

                <nav className="expense-route-nav">

                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                    >
                        <LayoutDashboard size={20} />

                        <span>
                            Dashboard
                        </span>
                    </button>


                    <button
                        type="button"
                        className="expense-route-nav-active"
                    >
                        <Receipt size={20} />

                        <span>
                            Expenses
                        </span>
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                    >
                        <Tag size={20} />

                        <span>
                            Categories
                        </span>
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate("/budget")}
                    >
                        <Wallet size={20} />

                        <span>
                            Budgets
                        </span>
                    </button>

                </nav>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="expense-route-content">

                {showAddExpense ? (

                    <AddExpenseForm
                        onCancel={() =>
                            setShowAddExpense(false)
                        }
                    />

                ) : (

                    <ExpensesPage
                        onAddExpense={() =>
                            setShowAddExpense(true)
                        }
                    />

                )}

            </main>


            {/* =====================================================
                PAGE CSS
            ===================================================== */}

            <style>{`

                /* =================================================
                   GLOBAL RESET FOR THIS PAGE
                ================================================= */

                .expense-route-shell,
                .expense-route-shell * {
                    box-sizing: border-box;
                }


                .expense-route-shell {

                    width: 100%;

                    min-height: 100vh;

                    display: flex;

                    background: #06110d;

                    color: #f4f7f5;

                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                }


                /* =================================================
                   SIDEBAR
                ================================================= */

                .expense-route-sidebar {

                    position: fixed;

                    left: 0;

                    top: 0;

                    bottom: 0;

                    width: 272px;

                    height: 100vh;

                    background: #071610;

                    border-right: 1px solid #183329;

                    z-index: 1000;

                    overflow-y: auto;

                }


                /* =================================================
                   LOGO
                ================================================= */

                .expense-route-logo {

                    height: 94px;

                    width: 100%;

                    display: flex;

                    align-items: center;

                    padding: 0 24px;

                    border-bottom: 1px solid #10271e;

                }


                .expense-route-logo-icon {

                    width: 38px;

                    height: 38px;

                    flex-shrink: 0;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 10px;

                    background: #35d8a4;

                    color: #062017;

                    margin-right: 12px;

                }


                .expense-route-logo-text {

                    color: #f4f7f5;

                    font-size: 20px;

                    font-weight: 700;

                    letter-spacing: -0.5px;

                    white-space: nowrap;

                }


                .expense-route-logo-text span {

                    color: #31d6a0;

                }


                /* =================================================
                   NAVIGATION
                ================================================= */

                .expense-route-nav {

                    width: 100%;

                    padding: 24px 10px;

                    display: flex;

                    flex-direction: column;

                    gap: 7px;

                }


                .expense-route-nav button {

                    width: 100%;

                    height: 56px;

                    border: none;

                    outline: none;

                    background: transparent;

                    color: #8ba49b;

                    display: flex;

                    align-items: center;

                    gap: 14px;

                    padding: 0 16px;

                    border-radius: 12px;

                    cursor: pointer;

                    font-family: inherit;

                    font-size: 14px;

                    font-weight: 500;

                    text-align: left;

                    transition:
                        background 0.2s ease,
                        color 0.2s ease,
                        transform 0.2s ease;

                }


                .expense-route-nav button svg {

                    flex-shrink: 0;

                }


                .expense-route-nav button:hover {

                    background: #0c241b;

                    color: #e9f5ef;

                }


                .expense-route-nav-active {

                    background: #0c3025 !important;

                    color: #f4fffa !important;

                    box-shadow:
                        inset 3px 0 0 #32d8a2;

                }


                /* =================================================
                   MAIN AREA
                ================================================= */

                .expense-route-content {

                    width: calc(100% - 272px);

                    min-height: 100vh;

                    margin-left: 272px;

                    padding: 0;

                    overflow-x: hidden;

                    overflow-y: visible;

                    position: relative;

                }


                /*
                ====================================================
                IMPORTANT OVERRIDES

                ExpensesPage apparently has its own max-width,
                margin, padding or centered layout.

                These rules make its OUTER container use the
                entire available content area.
                ====================================================
                */


                .expense-route-content > * {

                    width: 100% !important;

                    max-width: none !important;

                    min-width: 0 !important;

                    margin-left: 0 !important;

                    margin-right: 0 !important;

                }


                /*
                If ExpensesPage uses one of these common wrappers,
                force them to stretch as well.
                */

                .expense-route-content .expenses-page,

                .expense-route-content .expenses-container,

                .expense-route-content .expenses-wrapper,

                .expense-route-content .expense-page,

                .expense-route-content .expense-container,

                .expense-route-content .page-container,

                .expense-route-content .main-container {

                    width: 100% !important;

                    max-width: none !important;

                    margin-left: 0 !important;

                    margin-right: 0 !important;

                }


                /*
                Remove accidental centering from nested containers.
                */

                .expense-route-content .container {

                    width: 100% !important;

                    max-width: none !important;

                    margin-left: 0 !important;

                    margin-right: 0 !important;

                }


                /* =================================================
                   RESPONSIVE - TABLET
                ================================================= */

                @media (max-width: 1000px) {

                    .expense-route-sidebar {

                        width: 220px;

                    }


                    .expense-route-content {

                        width: calc(100% - 220px);

                        margin-left: 220px;

                    }

                }


                /* =================================================
                   RESPONSIVE - MOBILE
                ================================================= */

                @media (max-width: 700px) {

                    .expense-route-shell {

                        display: block;

                        width: 100%;

                    }


                    .expense-route-sidebar {

                        position: static;

                        width: 100%;

                        height: auto;

                        min-height: auto;

                        border-right: none;

                        border-bottom: 1px solid #183329;

                    }


                    .expense-route-logo {

                        height: 72px;

                        padding: 0 18px;

                    }


                    .expense-route-nav {

                        flex-direction: row;

                        overflow-x: auto;

                        padding: 10px;

                    }


                    .expense-route-nav button {

                        width: auto;

                        min-width: max-content;

                        height: 48px;

                        padding: 0 18px;

                    }


                    .expense-route-content {

                        width: 100%;

                        margin-left: 0;

                    }

                }

            `}</style>

        </div>
    )
}


export default Expenses