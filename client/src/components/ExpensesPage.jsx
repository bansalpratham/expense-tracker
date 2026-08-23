import { useEffect, useMemo, useState } from "react"

import {
    CalendarDays,
    Filter,
    Plus,
    Search,
    Trash2,
    X
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"

import {
    getExpenses,
    deleteExpense,
    getExpensesByDate
} from "../redux/slices/expenseSlice"

import {
    getCategories
} from "../redux/slices/categorySlice"


function DeleteExpenseDialog({ expense, onCancel, onConfirm }) {

    return (
        <div className="expense-dialog-backdrop">

            <div
                className="expense-dialog"
                role="dialog"
                aria-modal="true"
            >

                <button
                    className="form-close-button"
                    onClick={onCancel}
                    aria-label="Close dialog"
                >
                    <X />
                </button>

                <span className="dialog-trash">
                    <Trash2 />
                </span>

                <h2>
                    Delete this expense?
                </h2>

                <p>
                    This action cannot be undone.
                    Remove{" "}
                    <strong>
                        {expense.description || "this expense"}
                    </strong>
                    ?
                </p>

                <div className="expense-form-actions">

                    <button
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="danger-button"
                        onClick={onConfirm}
                    >
                        Delete expense
                    </button>

                </div>

            </div>

        </div>
    )
}


function ExpensesPage({ onAddExpense }) {

    const dispatch = useDispatch()

    const expenses = useSelector(
        (state) => state.expense.expenses
    )

    const categories = useSelector(
        (state) => state.category.categories
    )

    const [query, setQuery] = useState("")

    const [startDate, setStartDate] = useState("")

    const [endDate, setEndDate] = useState("")

    const [pendingDelete, setPendingDelete] = useState(null)

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")


    /*
        Fetch expenses and categories
        when the page loads.
    */

    useEffect(() => {

        loadData()

    }, [])


    const loadData = async () => {

        try {

            setLoading(true)

            setError("")

            await Promise.all([
                dispatch(getExpenses()).unwrap(),
                dispatch(getCategories()).unwrap()
            ])

        } catch (error) {

            console.error(error)

            setError(
                typeof error === "string"
                    ? error
                    : "Unable to load expenses."
            )

        } finally {

            setLoading(false)

        }

    }


    /*
        Find category name using category_id
        from the expense.
    */

    const getCategoryName = (categoryId) => {

        const category = categories.find(
            (category) =>
                String(category.id) === String(categoryId)
        )

        return category
            ? category.name
            : "Uncategorized"
    }


    /*
        Search expenses locally.
    */

    const visibleExpenses = useMemo(() => {

        return expenses.filter((expense) => {

            const description =
                expense.description?.toLowerCase() || ""

            const category =
                getCategoryName(
                    expense.category_id
                ).toLowerCase()

            const search =
                query.toLowerCase()

            return (
                description.includes(search) ||
                category.includes(search)
            )

        })

    }, [expenses, query, categories])


    /*
        Calculate total spending.
    */

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount || 0),
        0
    )


    const average =
        expenses.length > 0
            ? total / expenses.length
            : 0


    const formatAmount = (amount) => {

        return `₹${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`

    }


    const formatDate = (date) => {

        if (!date) {
            return "—"
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )

    }


    /*
        Delete expense.
    */

    const handleDelete = async () => {

        if (!pendingDelete) {
            return
        }

        try {

            setLoading(true)

            await dispatch(
                deleteExpense(pendingDelete.id)
            ).unwrap()

            setPendingDelete(null)

        } catch (error) {

            console.error(error)

        } finally {

            setLoading(false)

        }

    }


    /*
        Filter expenses using backend.
    */

    const handleFilter = async () => {

        if (!startDate || !endDate) {
            return
        }

        try {

            setLoading(true)

            setError("")

            await dispatch(
                getExpensesByDate({
                    startDate,
                    endDate
                })
            ).unwrap()

        } catch (error) {

            console.error(error)

            setError(
                typeof error === "string"
                    ? error
                    : "Unable to filter expenses."
            )

        } finally {

            setLoading(false)

        }

    }


    /*
        Clear date filter
        and fetch all expenses again.
    */

    const handleClearFilter = async () => {

        setStartDate("")

        setEndDate("")

        setQuery("")

        await loadData()

    }


    return (

        <div className="expenses-page">


            {/* HEADER */}

            <div className="expenses-page-heading">

                <div>

                    <p className="section-kicker">
                        ExpenseFlow / Ledger
                    </p>

                    <h1>
                        Expense History
                    </h1>

                    <p>
                        Track and manage your recent spending.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={onAddExpense}
                >

                    <Plus />

                    Add expense

                </button>

            </div>


            {/* SUMMARY */}

            <section
                className="expense-summary-grid"
                aria-label="Expense summary"
            >

                <div>

                    <span>
                        Total expenses
                    </span>

                    <strong>
                        {formatAmount(total)}
                    </strong>

                    <small>
                        All recorded spending
                    </small>

                </div>


                <div>

                    <span>
                        Transactions
                    </span>

                    <strong>
                        {expenses.length}
                    </strong>

                    <small>
                        Total expenses
                    </small>

                </div>


                <div>

                    <span>
                        Average expense
                    </span>

                    <strong>
                        {formatAmount(average)}
                    </strong>

                    <small>
                        Per transaction
                    </small>

                </div>

            </section>


            {/* FILTERS */}

            <section
                className="expense-toolbar"
                aria-label="Expense filters"
            >

                <label className="expense-search">

                    <Search />

                    <input
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder="Search expenses"
                    />

                </label>


                <label className="date-input">

                    <CalendarDays />

                    <input
                        type="date"
                        value={startDate}
                        onChange={(event) =>
                            setStartDate(event.target.value)
                        }
                    />

                </label>


                <span className="date-separator">
                    to
                </span>


                <label className="date-input">

                    <CalendarDays />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(event) =>
                            setEndDate(event.target.value)
                        }
                    />

                </label>


                <button
                    className="filter-button"
                    onClick={handleFilter}
                    disabled={loading}
                >

                    <Filter />

                    Apply Filter

                </button>


                <button
                    className="clear-filter"
                    onClick={handleClearFilter}
                    disabled={loading}
                >
                    Clear Filter
                </button>

            </section>


            {/* ERROR */}

            {error && (

                <div className="expense-error">

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-button"
                        onClick={loadData}
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* EXPENSE TABLE */}

            <section className="expenses-table-card">

                <div className="expenses-table-heading">

                    <div>

                        <h2>
                            All expenses
                        </h2>

                        <p>
                            {expenses.length} total expenses
                        </p>

                    </div>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="expense-skeleton-list">

                        {[1, 2, 3].map((item) => (

                            <div
                                className="expense-skeleton"
                                key={item}
                            >

                                <i />

                                <span />

                                <b />

                            </div>

                        ))}

                    </div>

                ) : visibleExpenses.length === 0 ? (

                    /* EMPTY */

                    <div className="expense-empty">

                        <span className="empty-icon">
                            ₹
                        </span>

                        <h3>
                            No expenses yet
                        </h3>

                        <p>
                            Start tracking your spending
                            by adding your first expense.
                        </p>

                        <button
                            className="primary-button"
                            onClick={onAddExpense}
                        >

                            <Plus />

                            Add your first expense

                        </button>

                    </div>

                ) : (

                    <>

                        {/* DESKTOP TABLE */}

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

                                        <th />

                                    </tr>

                                </thead>


                                <tbody>

                                    {visibleExpenses.map(
                                        (expense) => (

                                            <tr key={expense.id}>

                                                <td className="expense-description">

                                                    {expense.description ||
                                                        "Untitled expense"}

                                                </td>


                                                <td>

                                                    <span className="expense-category-badge">

                                                        {getCategoryName(
                                                            expense.category_id
                                                        )}

                                                    </span>

                                                </td>


                                                <td className="expense-date">

                                                    {formatDate(
                                                        expense.date
                                                    )}

                                                </td>


                                                <td className="expense-amount">

                                                    {formatAmount(
                                                        expense.amount
                                                    )}

                                                </td>


                                                <td>

                                                    <button
                                                        className="expense-delete"
                                                        onClick={() =>
                                                            setPendingDelete(
                                                                expense
                                                            )
                                                        }
                                                        aria-label="Delete expense"
                                                    >

                                                        <Trash2 />

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* MOBILE */}

                        <div className="expense-mobile-list">

                            {visibleExpenses.map(
                                (expense) => (

                                    <article
                                        className="expense-mobile-card"
                                        key={expense.id}
                                    >

                                        <div>

                                            <strong>
                                                {expense.description ||
                                                    "Untitled expense"}
                                            </strong>

                                            <span>

                                                {getCategoryName(
                                                    expense.category_id
                                                )}

                                                {" · "}

                                                {formatDate(
                                                    expense.date
                                                )}

                                            </span>

                                        </div>


                                        <div>

                                            <b>
                                                {formatAmount(
                                                    expense.amount
                                                )}
                                            </b>

                                            <button
                                                className="expense-delete"
                                                onClick={() =>
                                                    setPendingDelete(
                                                        expense
                                                    )
                                                }
                                            >

                                                <Trash2 />

                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    </>

                )}

            </section>


            {/* DELETE DIALOG */}

            {pendingDelete && (

                <DeleteExpenseDialog

                    expense={pendingDelete}

                    onCancel={() =>
                        setPendingDelete(null)
                    }

                    onConfirm={handleDelete}

                />

            )}

        </div>

    )

}

export default ExpensesPage