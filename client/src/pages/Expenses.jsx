import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    LayoutDashboard,
    Receipt,
    Tag,
    Wallet,
    CircleDollarSign
} from "lucide-react"

import {
    useDispatch,
    useSelector
} from "react-redux"

import ExpensesPage from "../components/ExpensesPage"
import AddExpenseForm from "../components/AddExpenseForm"

import {
    addExpense
} from "../redux/slices/expenseSlice"


function Expenses() {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const categories = useSelector(
        (state) => state.category.categories
    )

    const [showAddExpense, setShowAddExpense] = useState(false)

    const [addingExpense, setAddingExpense] = useState(false)


    return (

        <div className="expense-route-shell">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="expense-route-sidebar">

                <div className="expense-route-logo">

                    <div className="expense-route-logo-icon">
                        <CircleDollarSign size={21} />
                    </div>

                    <span className="expense-route-logo-text">
                        Expense<span>Flow</span>
                    </span>

                </div>


                <nav className="expense-route-nav">

                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>


                    <button
                        type="button"
                        className="expense-route-nav-active"
                    >
                        <Receipt size={20} />
                        <span>Expenses</span>
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                    >
                        <Tag size={20} />
                        <span>Categories</span>
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate("/budget")}
                    >
                        <Wallet size={20} />
                        <span>Budgets</span>
                    </button>

                </nav>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="expense-route-content">

                {showAddExpense ? (

                    <div className="expense-add-page">

                        <AddExpenseForm

                            categories={categories}

                            loading={addingExpense}

                            onCancel={() => {

                                if (!addingExpense) {
                                    setShowAddExpense(false)
                                }

                            }}

                            onSubmit={async (expenseData) => {

                                try {

                                    setAddingExpense(true)

                                    await dispatch(
                                        addExpense(expenseData)
                                    ).unwrap()

                                    setShowAddExpense(false)

                                } catch (error) {

                                    console.error(
                                        "Failed to add expense:",
                                        error
                                    )

                                } finally {

                                    setAddingExpense(false)

                                }

                            }}

                        />

                    </div>

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
                   RESET
                ================================================= */

                .expense-route-shell,
                .expense-route-shell * {
                    box-sizing: border-box;
                }


                html,
                body {
                    margin: 0;
                    padding: 0;
                }


                button,
                input,
                select {
                    font-family: inherit;
                }


                /* =================================================
                   PAGE SHELL
                ================================================= */

                .expense-route-shell {

                    width: 100%;

                    min-height: 100vh;

                    display: flex;

                    background:
                        radial-gradient(
                            circle at 80% 0%,
                            rgba(31, 110, 83, 0.10),
                            transparent 35%
                        ),
                        #06110d;

                    color: #f4f8f6;

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

                    top: 0;
                    left: 0;
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

                    width: 40px;

                    height: 40px;

                    flex-shrink: 0;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 11px;

                    background: #35d8a4;

                    color: #062017;

                    margin-right: 12px;

                    box-shadow:
                        0 8px 20px rgba(53, 216, 164, 0.16);

                }


                .expense-route-logo-text {

                    color: #f4f7f5;

                    font-size: 20px;

                    font-weight: 750;

                    letter-spacing: -0.6px;

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

                    color: #809b91;

                    display: flex;

                    align-items: center;

                    gap: 14px;

                    padding: 0 16px;

                    border-radius: 12px;

                    cursor: pointer;

                    font-family: inherit;

                    font-size: 14px;

                    font-weight: 550;

                    text-align: left;

                    transition:
                        background 0.2s ease,
                        color 0.2s ease,
                        transform 0.2s ease;

                }


                .expense-route-nav button svg {

                    flex-shrink: 0;

                    opacity: 0.9;

                }


                .expense-route-nav button:hover {

                    background: #0c241b;

                    color: #edf8f3;

                    transform: translateX(2px);

                }


                .expense-route-nav-active {

                    background:
                        linear-gradient(
                            90deg,
                            #0e3429,
                            #0b2c22
                        ) !important;

                    color: #f4fffa !important;

                    box-shadow:
                        inset 3px 0 0 #32d8a2;

                }


                .expense-route-nav-active svg {

                    color: #35d8a4;

                }


                /* =================================================
                   MAIN AREA
                ================================================= */

                .expense-route-content {

                    width: calc(100% - 272px);

                    min-height: 100vh;

                    margin-left: 272px;

                    padding: 0;

                    position: relative;

                    overflow-x: hidden;

                }


                /* =================================================
                   EXPENSES PAGE OUTER
                ================================================= */

                .expense-route-content > .expenses-page {

                    width: 100% !important;

                    max-width: none !important;

                    min-height: 100vh;

                    margin: 0 !important;

                    padding:
                        42px
                        48px
                        70px
                        48px !important;

                    background: transparent;

                }


                /* =================================================
                   PAGE HEADER
                ================================================= */

                .expense-route-content .expenses-page-heading {

                    width: 100%;

                    display: flex;

                    align-items: flex-end;

                    justify-content: space-between;

                    gap: 30px;

                    margin-bottom: 32px;

                }


                .expense-route-content .expenses-page-heading > div {

                    min-width: 0;

                }


                .expense-route-content .section-kicker {

                    margin: 0 0 8px;

                    color: #39dca7;

                    font-size: 12px;

                    font-weight: 700;

                    letter-spacing: 0.09em;

                    text-transform: uppercase;

                }


                .expense-route-content .expenses-page-heading h1 {

                    margin: 0;

                    color: #f4fff9;

                    font-size: clamp(32px, 3vw, 42px);

                    line-height: 1.1;

                    font-weight: 700;

                    letter-spacing: -1.4px;

                }


                .expense-route-content .expenses-page-heading p:last-child {

                    margin: 10px 0 0;

                    color: #76978d;

                    font-size: 14px;

                    line-height: 1.5;

                }


                /* =================================================
                   PRIMARY BUTTON
                ================================================= */

                .expense-route-content .primary-button {

                    height: 48px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 9px;

                    padding: 0 20px;

                    border: none;

                    border-radius: 11px;

                    background: #35d8a4;

                    color: #04130e;

                    font-size: 14px;

                    font-weight: 700;

                    cursor: pointer;

                    white-space: nowrap;

                    box-shadow:
                        0 8px 24px rgba(53, 216, 164, 0.12);

                    transition:
                        transform 0.2s ease,
                        background 0.2s ease,
                        box-shadow 0.2s ease;

                }


                .expense-route-content .primary-button:hover {

                    background: #43e2b0;

                    transform: translateY(-1px);

                    box-shadow:
                        0 12px 28px rgba(53, 216, 164, 0.18);

                }


                .expense-route-content .primary-button svg {

                    width: 18px;

                    height: 18px;

                }


                /* =================================================
                   SUMMARY CARDS
                ================================================= */

                .expense-route-content .expense-summary-grid {

                    display: grid;

                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));

                    gap: 18px;

                    margin-bottom: 26px;

                }


                .expense-route-content .expense-summary-grid > div {

                    min-width: 0;

                    min-height: 142px;

                    display: flex;

                    flex-direction: column;

                    justify-content: center;

                    padding: 22px 24px;

                    border: 1px solid #17382e;

                    border-radius: 15px;

                    background:
                        linear-gradient(
                            145deg,
                            #091c16,
                            #081812
                        );

                    box-shadow:
                        0 10px 28px rgba(0, 0, 0, 0.12);

                }


                .expense-route-content
                .expense-summary-grid
                span {

                    display: block;

                    margin-bottom: 9px;

                    color: #77998e;

                    font-size: 12px;

                    font-weight: 600;

                    text-transform: uppercase;

                    letter-spacing: 0.05em;

                }


                .expense-route-content
                .expense-summary-grid
                strong {

                    display: block;

                    color: #f1fff9;

                    font-size: 25px;

                    line-height: 1.2;

                    font-weight: 700;

                    letter-spacing: -0.5px;

                }


                .expense-route-content
                .expense-summary-grid
                small {

                    display: block;

                    margin-top: 7px;

                    color: #64857b;

                    font-size: 12px;

                }


                /* =================================================
                   FILTER TOOLBAR
                ================================================= */

                .expense-route-content .expense-toolbar {

                    width: 100%;

                    min-height: 82px;

                    display: flex;

                    align-items: center;

                    gap: 12px;

                    padding: 16px;

                    margin-bottom: 22px;

                    border: 1px solid #17382e;

                    border-radius: 15px;

                    background: #081a14;

                    box-shadow:
                        0 10px 30px rgba(0, 0, 0, 0.10);

                }


                /* SEARCH */

                .expense-route-content .expense-search {

                    height: 48px;

                    flex: 1 1 auto;

                    min-width: 220px;

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    padding: 0 14px;

                    border: 1px solid #1b4034;

                    border-radius: 10px;

                    background: #071710;

                }


                .expense-route-content .expense-search svg {

                    width: 19px;

                    height: 19px;

                    color: #6f9187;

                    flex-shrink: 0;

                }


                .expense-route-content .expense-search input {

                    width: 100%;

                    min-width: 0;

                    height: 100%;

                    border: none;

                    outline: none;

                    background: transparent;

                    color: #eafff6;

                    font-size: 14px;

                }


                .expense-route-content
                .expense-search input::placeholder {

                    color: #628177;

                }


                /* DATE INPUT */

                .expense-route-content .date-input {

                    width: 178px;

                    height: 48px;

                    flex-shrink: 0;

                    display: flex;

                    align-items: center;

                    gap: 9px;

                    padding: 0 12px;

                    border: 1px solid #1b4034;

                    border-radius: 10px;

                    background: #071710;

                }


                .expense-route-content .date-input svg {

                    width: 18px;

                    color: #70968b;

                    flex-shrink: 0;

                }


                .expense-route-content .date-input input {

                    width: 100%;

                    min-width: 0;

                    border: none;

                    outline: none;

                    background: transparent;

                    color: #eafff6;

                    font-size: 13px;

                }


                .expense-route-content .date-input input::-webkit-calendar-picker-indicator {

                    filter: invert(0.75);

                    cursor: pointer;

                }


                .expense-route-content .date-separator {

                    flex-shrink: 0;

                    color: #66867d;

                    font-size: 13px;

                }


                /* FILTER BUTTON */

                .expense-route-content .filter-button {

                    height: 48px;

                    flex-shrink: 0;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    padding: 0 17px;

                    border: none;

                    border-radius: 10px;

                    background: #35d8a4;

                    color: #04130e;

                    font-size: 13px;

                    font-weight: 700;

                    cursor: pointer;

                    white-space: nowrap;

                }


                .expense-route-content .filter-button:hover {

                    background: #43e2b0;

                }


                .expense-route-content .filter-button:disabled {

                    opacity: 0.55;

                    cursor: not-allowed;

                }


                .expense-route-content .clear-filter {

                    height: 48px;

                    flex-shrink: 0;

                    padding: 0 12px;

                    border: none;

                    background: transparent;

                    color: #8aa69d;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;

                    white-space: nowrap;

                }


                .expense-route-content .clear-filter:hover {

                    color: #d8eee7;

                }


                /* =================================================
                   TABLE CARD
                ================================================= */

                .expense-route-content .expenses-table-card {

                    width: 100%;

                    overflow: hidden;

                    border: 1px solid #17382e;

                    border-radius: 16px;

                    background:
                        linear-gradient(
                            145deg,
                            #081b15,
                            #071711
                        );

                    box-shadow:
                        0 14px 35px rgba(0, 0, 0, 0.13);

                }


                /* TABLE HEADER */

                .expense-route-content .expenses-table-heading {

                    min-height: 96px;

                    display: flex;

                    align-items: center;

                    padding: 22px 26px;

                    border-bottom: 1px solid #17382e;

                }


                .expense-route-content .expenses-table-heading h2 {

                    margin: 0;

                    color: #effff8;

                    font-size: 19px;

                    font-weight: 650;

                    letter-spacing: -0.3px;

                }


                .expense-route-content .expenses-table-heading p {

                    margin: 7px 0 0;

                    color: #64877c;

                    font-size: 12px;

                }


                /* =================================================
                   DESKTOP TABLE
                ================================================= */

                .expense-route-content .expenses-table-wrap {

                    width: 100%;

                    overflow-x: auto;

                }


                .expense-route-content .expenses-table-wrap table {

                    width: 100%;

                    border-collapse: collapse;

                    table-layout: fixed;

                }


                .expense-route-content .expenses-table-wrap th {

                    height: 48px;

                    padding: 0 14px;

                    color: #64897e;

                    background: #071711;

                    border-bottom: 1px solid #17382e;

                    font-size: 11px;

                    font-weight: 650;

                    letter-spacing: 0.05em;

                    text-transform: uppercase;

                    text-align: left;

                }


                .expense-route-content .expenses-table-wrap th:first-child,
                .expense-route-content .expenses-table-wrap td:first-child {

                    padding-left: 26px;

                }


                .expense-route-content .expenses-table-wrap th:last-child,
                .expense-route-content .expenses-table-wrap td:last-child {

                    width: 70px;

                    padding-right: 20px;

                }


                .expense-route-content .expenses-table-wrap th:nth-child(1) {

                    width: 31%;

                }


                .expense-route-content .expenses-table-wrap th:nth-child(2) {

                    width: 23%;

                }


                .expense-route-content .expenses-table-wrap th:nth-child(3) {

                    width: 18%;

                }


                .expense-route-content .expenses-table-wrap th:nth-child(4) {

                    width: 20%;

                }


                .expense-route-content .expenses-table-wrap td {

                    height: 66px;

                    padding: 0 14px;

                    color: #b6ccc5;

                    border-bottom: 1px solid #132f26;

                    font-size: 13px;

                    vertical-align: middle;

                }


                .expense-route-content .expenses-table-wrap tbody tr {

                    transition:
                        background 0.18s ease;

                }


                .expense-route-content .expenses-table-wrap tbody tr:hover {

                    background: rgba(37, 112, 84, 0.08);

                }


                .expense-route-content
                .expenses-table-wrap
                tbody tr:last-child td {

                    border-bottom: none;

                }


                .expense-route-content .expense-description {

                    color: #effff8 !important;

                    font-weight: 600;

                }


                .expense-route-content .expense-date {

                    color: #789a90 !important;

                }


                .expense-route-content .expense-amount {

                    color: #42dca9 !important;

                    font-weight: 700;

                    text-align: left;

                }


                .expense-route-content .amount-head {

                    text-align: left;

                }


                /* CATEGORY */

                .expense-route-content .expense-category-badge {

                    display: inline-flex;

                    align-items: center;

                    min-height: 28px;

                    padding: 0 10px;

                    border: 1px solid #20503e;

                    border-radius: 7px;

                    background: #0b251c;

                    color: #79ad9e;

                    font-size: 11px;

                    font-weight: 600;

                }


                /* DELETE */

                .expense-route-content .expense-delete {

                    width: 34px;

                    height: 34px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    border: 1px solid transparent;

                    border-radius: 8px;

                    background: transparent;

                    color: #75978d;

                    cursor: pointer;

                    transition:
                        background 0.18s ease,
                        color 0.18s ease,
                        border-color 0.18s ease;

                }


                .expense-route-content .expense-delete:hover {

                    background: rgba(255, 91, 105, 0.10);

                    border-color: rgba(255, 91, 105, 0.18);

                    color: #ff7f89;

                }


                .expense-route-content .expense-delete svg {

                    width: 17px;

                    height: 17px;

                }


                /* =================================================
                   MOBILE LIST
                   IMPORTANT: HIDDEN ON DESKTOP
                ================================================= */

                .expense-route-content .expense-mobile-list {

                    display: none !important;

                }


                /* =================================================
                   EMPTY STATE
                ================================================= */

                .expense-route-content .expense-empty {

                    min-height: 280px;

                    display: flex;

                    flex-direction: column;

                    align-items: center;

                    justify-content: center;

                    padding: 40px 20px;

                    text-align: center;

                }


                .expense-route-content .empty-icon {

                    width: 48px;

                    height: 48px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    margin-bottom: 16px;

                    border-radius: 13px;

                    background: #0d3025;

                    color: #39dca7;

                    font-size: 20px;

                    font-weight: 700;

                }


                .expense-route-content .expense-empty h3 {

                    margin: 0;

                    color: #eafff5;

                    font-size: 18px;

                }


                .expense-route-content .expense-empty p {

                    max-width: 380px;

                    margin: 8px 0 20px;

                    color: #698a80;

                    font-size: 13px;

                    line-height: 1.6;

                }


                /* =================================================
                   ERROR
                ================================================= */

                .expense-route-content .expense-error {

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    margin-bottom: 20px;

                    padding: 16px 18px;

                    border: 1px solid rgba(255, 100, 110, 0.20);

                    border-radius: 12px;

                    background: rgba(100, 25, 32, 0.18);

                }


                .expense-route-content .expense-error p {

                    margin: 0;

                    color: #ff9299;

                    font-size: 13px;

                }


                /* =================================================
                   SKELETON
                ================================================= */

                .expense-route-content .expense-skeleton-list {

                    padding: 10px 0;

                }


                .expense-route-content .expense-skeleton {

                    height: 66px;

                    display: flex;

                    align-items: center;

                    gap: 18px;

                    padding: 0 26px;

                    border-bottom: 1px solid #132f26;

                }


                .expense-route-content .expense-skeleton i,
                .expense-route-content .expense-skeleton span,
                .expense-route-content .expense-skeleton b {

                    display: block;

                    height: 12px;

                    border-radius: 6px;

                    background: #102a21;

                    animation: expenseSkeleton 1.3s infinite ease-in-out;

                }


                .expense-route-content .expense-skeleton i {

                    width: 25%;

                }


                .expense-route-content .expense-skeleton span {

                    width: 20%;

                }


                .expense-route-content .expense-skeleton b {

                    width: 15%;

                    margin-left: auto;

                }


                @keyframes expenseSkeleton {

                    0%,
                    100% {
                        opacity: 0.45;
                    }

                    50% {
                        opacity: 0.9;
                    }

                }


                /* =================================================
                   ADD EXPENSE PAGE
                ================================================= */

                .expense-add-page {

                    width: 100%;

                    min-height: 100vh;

                    padding:
                        42px
                        48px
                        70px;

                }


                .expense-add-page > * {

                    width: 100% !important;

                    max-width: none !important;

                    margin: 0 !important;

                }


                /* =================================================
                   TABLET
                ================================================= */

                @media (max-width: 1100px) {

                    .expense-route-sidebar {

                        width: 220px;

                    }


                    .expense-route-content {

                        width: calc(100% - 220px);

                        margin-left: 220px;

                    }


                    .expense-route-content > .expenses-page {

                        padding:
                            34px
                            30px
                            60px !important;

                    }


                    .expense-add-page {

                        padding:
                            34px
                            30px
                            60px;

                    }


                    .expense-route-content .expense-toolbar {

                        flex-wrap: wrap;

                    }


                    .expense-route-content .expense-search {

                        flex: 1 1 100%;

                    }


                    .expense-route-content .date-input {

                        flex: 1 1 180px;

                        width: auto;

                    }

                }


                /* =================================================
                   MOBILE
                ================================================= */

                @media (max-width: 700px) {

                    .expense-route-shell {

                        display: block;

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

                        padding: 0 17px;

                    }


                    .expense-route-content {

                        width: 100%;

                        margin-left: 0;

                    }


                    .expense-route-content > .expenses-page {

                        padding:
                            28px
                            18px
                            50px !important;

                    }


                    .expense-add-page {

                        padding:
                            24px
                            18px
                            50px;

                    }


                    .expense-route-content .expenses-page-heading {

                        align-items: flex-start;

                        flex-direction: column;

                        margin-bottom: 24px;

                    }


                    .expense-route-content .expenses-page-heading h1 {

                        font-size: 31px;

                    }


                    .expense-route-content
                    .expenses-page-heading
                    .primary-button {

                        width: 100%;

                    }


                    .expense-route-content .expense-summary-grid {

                        grid-template-columns: 1fr;

                        gap: 12px;

                    }


                    .expense-route-content
                    .expense-summary-grid
                    > div {

                        min-height: 116px;

                    }


                    .expense-route-content .expense-toolbar {

                        align-items: stretch;

                        flex-direction: column;

                        padding: 12px;

                    }


                    .expense-route-content .expense-search {

                        width: 100%;

                        min-width: 0;

                    }


                    .expense-route-content .date-input {

                        width: 100%;

                        flex: none;

                    }


                    .expense-route-content .date-separator {

                        display: none;

                    }


                    .expense-route-content .filter-button,
                    .expense-route-content .clear-filter {

                        width: 100%;

                    }


                    /* Hide desktop table */

                    .expense-route-content .expenses-table-wrap {

                        display: none !important;

                    }


                    /* Show mobile cards */

                    .expense-route-content .expense-mobile-list {

                        display: flex !important;

                        flex-direction: column;

                    }


                    .expense-route-content .expense-mobile-card {

                        min-height: 84px;

                        display: flex;

                        align-items: center;

                        justify-content: space-between;

                        gap: 16px;

                        padding: 16px 18px;

                        border-bottom: 1px solid #132f26;

                    }


                    .expense-route-content
                    .expense-mobile-card:last-child {

                        border-bottom: none;

                    }


                    .expense-route-content .expense-mobile-card > div:first-child {

                        min-width: 0;

                    }


                    .expense-route-content
                    .expense-mobile-card
                    strong {

                        display: block;

                        overflow: hidden;

                        color: #effff8;

                        font-size: 14px;

                        font-weight: 650;

                        text-overflow: ellipsis;

                        white-space: nowrap;

                    }


                    .expense-route-content
                    .expense-mobile-card
                    span {

                        display: block;

                        margin-top: 5px;

                        overflow: hidden;

                        color: #6f9086;

                        font-size: 11px;

                        text-overflow: ellipsis;

                        white-space: nowrap;

                    }


                    .expense-route-content
                    .expense-mobile-card
                    > div:last-child {

                        display: flex;

                        align-items: center;

                        gap: 8px;

                        flex-shrink: 0;

                    }


                    .expense-route-content
                    .expense-mobile-card
                    b {

                        color: #40dca8;

                        font-size: 14px;

                        white-space: nowrap;

                    }


                    .expense-route-content
                    .expenses-table-heading {

                        min-height: 82px;

                        padding: 18px;

                    }

                }

            `}</style>

        </div>
    )
}


export default Expenses