import { useEffect, useMemo, useState } from "react"

import { useNavigate } from "react-router-dom"

import {
    LayoutDashboard,
    Receipt,
    Tag,
    Wallet,
    CircleDollarSign,
    Search,
    CalendarDays,
    Filter,
    Trash2,
    Plus
} from "lucide-react"

import {
    useDispatch,
    useSelector
} from "react-redux"

import ExpensesPage from "../components/ExpensesPage"

import AddExpenseForm from "../components/AddExpenseForm"

import {
    addExpense,
    getExpenses,
    deleteExpense,
    getExpensesByDate,
    clearExpenseFilter
} from "../redux/slices/expenseSlice"


function Expenses() {

    const navigate = useNavigate()

    const dispatch = useDispatch()


    /*
    ====================================================
    REDUX
    ====================================================
    */

    const expenses = useSelector(
        (state) => state.expense.expenses
    )

    const categories = useSelector(
        (state) => state.category.categories
    )


    /*
    ====================================================
    LOCAL STATE
    ====================================================
    */

    const [showAddExpense, setShowAddExpense] =
        useState(false)

    const [addingExpense, setAddingExpense] =
        useState(false)


    const [search, setSearch] =
        useState("")


    const [startDate, setStartDate] =
        useState("")


    const [endDate, setEndDate] =
        useState("")


    const [filterLoading, setFilterLoading] =
        useState(false)


    /*
    ====================================================
    LOAD EXPENSES
    ====================================================
    */

    useEffect(() => {

        dispatch(getExpenses())

    }, [dispatch])


    /*
    ====================================================
    GET CATEGORY NAME
    ====================================================
    */

    const getCategoryName = (categoryId) => {

        const category = categories.find(
            category =>
                category.id === categoryId
        )

        return category
            ? category.name
            : "Unknown"

    }


    /*
    ====================================================
    SEARCH
    ====================================================
    */

    const filteredExpenses = useMemo(() => {

        if (!search.trim()) {

            return expenses

        }


        const searchValue =
            search.toLowerCase().trim()


        return expenses.filter(
            (expense) => {

                const description =
                    String(
                        expense.description || ""
                    ).toLowerCase()


                const categoryName =
                    getCategoryName(
                        expense.category_id
                    ).toLowerCase()


                const amount =
                    String(
                        expense.amount || ""
                    ).toLowerCase()


                return (
                    description.includes(
                        searchValue
                    ) ||

                    categoryName.includes(
                        searchValue
                    ) ||

                    amount.includes(
                        searchValue
                    )
                )

            }
        )

    }, [
        expenses,
        search,
        categories
    ])


    /*
    ====================================================
    APPLY DATE FILTER
    ====================================================
    */

    const handleFilter = async () => {

        if (!startDate || !endDate) {

            return

        }


        if (startDate > endDate) {

            alert(
                "Start date cannot be after end date"
            )

            return

        }


        try {

            setFilterLoading(true)


            await dispatch(
                getExpensesByDate({
                    startDate,
                    endDate
                })
            ).unwrap()


        } catch (error) {

            console.error(
                "Failed to filter expenses:",
                error
            )

        } finally {

            setFilterLoading(false)

        }

    }


    /*
    ====================================================
    CLEAR FILTER
    ====================================================
    */

    const handleClearFilter = () => {

        setStartDate("")

        setEndDate("")

        setSearch("")

        dispatch(
            clearExpenseFilter()
        )

    }


    /*
    ====================================================
    DELETE
    ====================================================
    */

    const handleDeleteExpense = async (
        expenseId
    ) => {

        try {

            await dispatch(
                deleteExpense(expenseId)
            ).unwrap()

        } catch (error) {

            console.error(
                "Failed to delete expense:",
                error
            )

        }

    }


    /*
    ====================================================
    ADD EXPENSE
    ====================================================
    */

    const handleAddExpense = async (
        expenseData
    ) => {

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

    }


    /*
    ====================================================
    ADD EXPENSE PAGE
    ====================================================
    */

    if (showAddExpense) {

        return (

            <div className="expense-route-shell">

                <aside className="expense-route-sidebar">

                    <div className="expense-route-logo">

                        <div className="expense-route-logo-icon">

                            <CircleDollarSign
                                size={21}
                            />

                        </div>

                        <span className="expense-route-logo-text">

                            Expense
                            <span>Flow</span>

                        </span>

                    </div>


                    <nav className="expense-route-nav">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/home")
                            }
                        >

                            <LayoutDashboard
                                size={20}
                            />

                            <span>
                                Dashboard
                            </span>

                        </button>


                        <button
                            type="button"
                            className="expense-route-nav-active"
                        >

                            <Receipt
                                size={20}
                            />

                            <span>
                                Expenses
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/categories")
                            }
                        >

                            <Tag
                                size={20}
                            />

                            <span>
                                Categories
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/budget")
                            }
                        >

                            <Wallet
                                size={20}
                            />

                            <span>
                                Budgets
                            </span>

                        </button>

                    </nav>

                </aside>


                <main className="expense-route-content">

                    <div className="expense-add-page">

                        <AddExpenseForm

                            categories={
                                categories
                            }

                            loading={
                                addingExpense
                            }

                            onCancel={() => {

                                if (
                                    !addingExpense
                                ) {

                                    setShowAddExpense(
                                        false
                                    )

                                }

                            }}

                            onSubmit={
                                handleAddExpense
                            }

                        />

                    </div>

                </main>

            </div>

        )

    }


    /*
    ====================================================
    MAIN PAGE
    ====================================================
    */

    return (

        <div className="expense-route-shell">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="expense-route-sidebar">

                <div className="expense-route-logo">

                    <div className="expense-route-logo-icon">

                        <CircleDollarSign
                            size={21}
                        />

                    </div>


                    <span className="expense-route-logo-text">

                        Expense
                        <span>Flow</span>

                    </span>

                </div>


                <nav className="expense-route-nav">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/home")
                        }
                    >

                        <LayoutDashboard
                            size={20}
                        />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        type="button"
                        className="expense-route-nav-active"
                    >

                        <Receipt
                            size={20}
                        />

                        <span>
                            Expenses
                        </span>

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/categories")
                        }
                    >

                        <Tag
                            size={20}
                        />

                        <span>
                            Categories
                        </span>

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/budget")
                        }
                    >

                        <Wallet
                            size={20}
                        />

                        <span>
                            Budgets
                        </span>

                    </button>

                </nav>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="expense-route-content">


                <div className="expenses-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="expenses-page-heading">

                        <div>

                            <p className="section-kicker">
                                Expense management
                            </p>

                            <h1>
                                Expenses
                            </h1>

                            <p>
                                Search, filter and manage
                                your expenses.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                setShowAddExpense(true)
                            }
                        >

                            <Plus size={18} />

                            Add Expense

                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="expense-summary-grid">

                        <div>

                            <span>
                                Total Expenses
                            </span>

                            <strong>
                                {filteredExpenses.length}
                            </strong>

                            <small>
                                Matching records
                            </small>

                        </div>


                        <div>

                            <span>
                                Total Amount
                            </span>

                            <strong>

                                ₹
                                {filteredExpenses
                                    .reduce(
                                        (
                                            total,
                                            expense
                                        ) =>
                                            total +
                                            Number(
                                                expense.amount ||
                                                0
                                            ),
                                        0
                                    )
                                    .toFixed(2)}

                            </strong>

                            <small>
                                Current selection
                            </small>

                        </div>


                        <div>

                            <span>
                                Search
                            </span>

                            <strong>
                                {search
                                    ? `"${search}"`
                                    : "All"}
                            </strong>

                            <small>
                                Active search
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER TOOLBAR
                    ================================================= */}

                    <div className="expense-toolbar">


                        {/* SEARCH */}

                        <div className="expense-search">

                            <Search size={19} />

                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* START DATE */}

                        <div className="date-input">

                            <CalendarDays
                                size={18}
                            />

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <span className="date-separator">
                            to
                        </span>


                        {/* END DATE */}

                        <div className="date-input">

                            <CalendarDays
                                size={18}
                            />

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* FILTER */}

                        <button
                            type="button"
                            className="filter-button"
                            disabled={
                                filterLoading ||
                                !startDate ||
                                !endDate
                            }
                            onClick={
                                handleFilter
                            }
                        >

                            <Filter size={17} />

                            {filterLoading
                                ? "Filtering..."
                                : "Filter"}

                        </button>


                        {/* CLEAR */}

                        <button
                            type="button"
                            className="clear-filter"
                            onClick={
                                handleClearFilter
                            }
                        >

                            Clear

                        </button>

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div className="expenses-table-card">


                        <div className="expenses-table-heading">

                            <div>

                                <h2>
                                    Expense History
                                </h2>

                                <p>
                                    {filteredExpenses.length}
                                    {" "}
                                    expense
                                    {filteredExpenses.length !== 1
                                        ? "s"
                                        : ""}
                                    {" "}found
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            DESKTOP TABLE
                        ================================================= */}

                        <div className="expenses-table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th className="amount-head">
                                            Amount
                                        </th>

                                        <th>
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredExpenses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "50px"
                                                }}
                                            >

                                                No expenses
                                                found.

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredExpenses.map(
                                            (expense) => (

                                                <tr
                                                    key={
                                                        expense.id
                                                    }
                                                >

                                                    <td className="expense-description">

                                                        {
                                                            expense.description
                                                        }

                                                    </td>


                                                    <td>

                                                        <span className="expense-category-badge">

                                                            {
                                                                getCategoryName(
                                                                    expense.category_id
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td className="expense-date">

                                                        {new Date(
                                                            expense.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )}

                                                    </td>


                                                    <td className="expense-amount">

                                                        ₹
                                                        {Number(
                                                            expense.amount
                                                        ).toFixed(2)}

                                                    </td>


                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="expense-delete"
                                                            onClick={() =>
                                                                handleDeleteExpense(
                                                                    expense.id
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            MOBILE LIST
                        ================================================= */}

                        <div className="expense-mobile-list">

                            {filteredExpenses.length === 0 ? (

                                <div className="expense-empty">

                                    <div className="empty-icon">
                                        <Receipt
                                            size={20}
                                        />
                                    </div>

                                    <h3>
                                        No expenses found
                                    </h3>

                                    <p>
                                        Try changing your
                                        search or date
                                        filters.
                                    </p>

                                </div>

                            ) : (

                                filteredExpenses.map(
                                    (expense) => (

                                        <div
                                            className="expense-mobile-card"
                                            key={
                                                expense.id
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        expense.description
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        getCategoryName(
                                                            expense.category_id
                                                        )
                                                    }
                                                    {" • "}
                                                    {new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                            </div>


                                            <div>

                                                <b>
                                                    ₹
                                                    {Number(
                                                        expense.amount
                                                    ).toFixed(2)}
                                                </b>


                                                <button
                                                    type="button"
                                                    className="expense-delete"
                                                    onClick={() =>
                                                        handleDeleteExpense(
                                                            expense.id
                                                        )
                                                    }
                                                >

                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            </main>


            {/* =================================================
                YOUR EXISTING CSS
            ================================================= */}

            <style>{`

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

                .expense-route-content {
                    width: calc(100% - 272px);
                    min-height: 100vh;
                    margin-left: 272px;
                    padding: 0;
                    position: relative;
                    overflow-x: hidden;
                }

                .expenses-page {
                    width: 100%;
                    min-height: 100vh;
                    margin: 0;
                    padding: 42px 48px 70px;
                    background: transparent;
                }

                .expenses-page-heading {
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 30px;
                    margin-bottom: 32px;
                }

                .section-kicker {
                    margin: 0 0 8px;
                    color: #39dca7;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                }

                .expenses-page-heading h1 {
                    margin: 0;
                    color: #f4fff9;
                    font-size: clamp(32px, 3vw, 42px);
                    line-height: 1.1;
                    font-weight: 700;
                    letter-spacing: -1.4px;
                }

                .expenses-page-heading p:last-child {
                    margin: 10px 0 0;
                    color: #76978d;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .primary-button {
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
                }

                .primary-button:hover {
                    background: #43e2b0;
                }

                .expense-summary-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                    gap: 18px;
                    margin-bottom: 26px;
                }

                .expense-summary-grid > div {
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
                }

                .expense-summary-grid span {
                    display: block;
                    margin-bottom: 9px;
                    color: #77998e;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .expense-summary-grid strong {
                    display: block;
                    color: #f1fff9;
                    font-size: 25px;
                    line-height: 1.2;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }

                .expense-summary-grid small {
                    display: block;
                    margin-top: 7px;
                    color: #64857b;
                    font-size: 12px;
                }

                .expense-toolbar {
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
                }

                .expense-search {
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

                .expense-search svg {
                    color: #6f9187;
                    flex-shrink: 0;
                }

                .expense-search input {
                    width: 100%;
                    min-width: 0;
                    height: 100%;
                    border: none;
                    outline: none;
                    background: transparent;
                    color: #eafff6;
                    font-size: 14px;
                }

                .expense-search input::placeholder {
                    color: #628177;
                }

                .date-input {
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

                .date-input svg {
                    width: 18px;
                    color: #70968b;
                    flex-shrink: 0;
                }

                .date-input input {
                    width: 100%;
                    min-width: 0;
                    border: none;
                    outline: none;
                    background: transparent;
                    color: #eafff6;
                    font-size: 13px;
                }

                .date-input input::-webkit-calendar-picker-indicator {
                    filter: invert(0.75);
                    cursor: pointer;
                }

                .date-separator {
                    flex-shrink: 0;
                    color: #66867d;
                    font-size: 13px;
                }

                .filter-button {
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

                .filter-button:hover {
                    background: #43e2b0;
                }

                .filter-button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .clear-filter {
                    height: 48px;
                    flex-shrink: 0;
                    padding: 0 12px;
                    border: none;
                    background: transparent;
                    color: #8aa69d;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .clear-filter:hover {
                    color: #d8eee7;
                }

                .expenses-table-card {
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
                }

                .expenses-table-heading {
                    min-height: 96px;
                    display: flex;
                    align-items: center;
                    padding: 22px 26px;
                    border-bottom: 1px solid #17382e;
                }

                .expenses-table-heading h2 {
                    margin: 0;
                    color: #effff8;
                    font-size: 19px;
                    font-weight: 650;
                }

                .expenses-table-heading p {
                    margin: 7px 0 0;
                    color: #64877c;
                    font-size: 12px;
                }

                .expenses-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .expenses-table-wrap table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                .expenses-table-wrap th {
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

                .expenses-table-wrap td {
                    height: 66px;
                    padding: 0 14px;
                    color: #b6ccc5;
                    border-bottom: 1px solid #132f26;
                    font-size: 13px;
                    vertical-align: middle;
                }

                .expense-description {
                    color: #effff8 !important;
                    font-weight: 600;
                }

                .expense-date {
                    color: #789a90 !important;
                }

                .expense-amount {
                    color: #42dca9 !important;
                    font-weight: 700;
                }

                .expense-category-badge {
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

                .expense-delete {
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
                }

                .expense-delete:hover {
                    background: rgba(255, 91, 105, 0.10);
                    border-color: rgba(255, 91, 105, 0.18);
                    color: #ff7f89;
                }

                .expense-mobile-list {
                    display: none;
                }

                .expense-add-page {
                    width: 100%;
                    min-height: 100vh;
                    padding: 42px 48px 70px;
                }

                @media (max-width: 1100px) {

                    .expense-route-sidebar {
                        width: 220px;
                    }

                    .expense-route-content {
                        width: calc(100% - 220px);
                        margin-left: 220px;
                    }

                    .expenses-page {
                        padding: 34px 30px 60px;
                    }

                    .expense-toolbar {
                        flex-wrap: wrap;
                    }

                    .expense-search {
                        flex: 1 1 100%;
                    }

                }

                @media (max-width: 700px) {

                    .expense-route-shell {
                        display: block;
                    }

                    .expense-route-sidebar {
                        position: static;
                        width: 100%;
                        height: auto;
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

                    .expenses-page {
                        padding: 28px 18px 50px;
                    }

                    .expenses-page-heading {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .expenses-page-heading .primary-button {
                        width: 100%;
                    }

                    .expense-summary-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .expense-toolbar {
                        align-items: stretch;
                        flex-direction: column;
                        padding: 12px;
                    }

                    .expense-search {
                        width: 100%;
                        min-width: 0;
                    }

                    .date-input {
                        width: 100%;
                    }

                    .date-separator {
                        display: none;
                    }

                    .filter-button,
                    .clear-filter {
                        width: 100%;
                    }

                    .expenses-table-wrap {
                        display: none;
                    }

                    .expense-mobile-list {
                        display: flex;
                        flex-direction: column;
                    }

                    .expense-mobile-card {
                        min-height: 84px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                        padding: 16px 18px;
                        border-bottom: 1px solid #132f26;
                    }

                    .expense-mobile-card > div:first-child {
                        min-width: 0;
                    }

                    .expense-mobile-card strong {
                        display: block;
                        overflow: hidden;
                        color: #effff8;
                        font-size: 14px;
                        font-weight: 650;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .expense-mobile-card span {
                        display: block;
                        margin-top: 5px;
                        overflow: hidden;
                        color: #6f9086;
                        font-size: 11px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .expense-mobile-card > div:last-child {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        flex-shrink: 0;
                    }

                    .expense-mobile-card b {
                        color: #40dca8;
                        font-size: 14px;
                        white-space: nowrap;
                    }

                }

            `}</style>

        </div>

    )

}


export default Expenses