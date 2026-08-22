import { useEffect, useMemo, useState } from "react"
import {
    CalendarDays,
    Filter,
    Plus,
    Search,
    Trash2,
    X,
    WalletCards
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"

import {
    getExpenses,
    deleteExpense,
    getExpensesByDate
} from "../redux/slices/expenseSlice"

import { getCategories } from "../redux/slices/categorySlice"


function ExpensesPage({ onAddExpense }) {

    const dispatch = useDispatch()

    const expenses = useSelector(
        state => state.expense.expenses
    )

    const categories = useSelector(
        state => state.category.categories
    )

    const [search, setSearch] = useState("")

    const [startDate, setStartDate] = useState("")

    const [endDate, setEndDate] = useState("")

    const [deleteItem, setDeleteItem] = useState(null)

    const [loading, setLoading] = useState(false)


    /* -------------------------------- */
    /* GET EXPENSES */
    /* -------------------------------- */

    useEffect(() => {

        dispatch(getExpenses())

        dispatch(getCategories())

    }, [dispatch])


    /* -------------------------------- */
    /* CATEGORY NAME */
    /* -------------------------------- */

    const getCategoryName = (categoryId) => {

        const category = categories.find(
            item => Number(item.id) === Number(categoryId)
        )

        return category?.name || "Unknown"

    }


    /* -------------------------------- */
    /* SEARCH */
    /* -------------------------------- */

    const filteredExpenses = useMemo(() => {

        return expenses.filter(expense => {

            const categoryName =
                getCategoryName(expense.category_id)

            const text =
                `${expense.description} ${categoryName}`
                    .toLowerCase()

            return text.includes(
                search.toLowerCase()
            )

        })

    }, [expenses, categories, search])


    /* -------------------------------- */
    /* TOTAL */
    /* -------------------------------- */

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount || 0),
        0
    )


    const average =
        expenses.length > 0
            ? Math.round(total / expenses.length)
            : 0


    /* -------------------------------- */
    /* DELETE */
    /* -------------------------------- */

    const handleDelete = async () => {

        if (!deleteItem) {
            return
        }

        try {

            setLoading(true)

            await dispatch(
                deleteExpense(deleteItem.id)
            ).unwrap()

            await dispatch(
                getExpenses()
            )

            setDeleteItem(null)

        } catch (error) {

            console.error(
                "Delete expense error:",
                error
            )

        } finally {

            setLoading(false)

        }

    }


    /* -------------------------------- */
    /* DATE FILTER */
    /* -------------------------------- */

    const handleFilter = () => {

        if (!startDate || !endDate) {
            return
        }

        dispatch(
            getExpensesByDate({
                startDate,
                endDate
            })
        )

    }


    /* -------------------------------- */
    /* CLEAR FILTER */
    /* -------------------------------- */

    const handleClearFilter = () => {

        setStartDate("")

        setEndDate("")

        setSearch("")

        dispatch(
            getExpenses()
        )

    }


    /* -------------------------------- */
    /* FORMAT DATE */
    /* -------------------------------- */

    const formatDate = (date) => {

        if (!date) {
            return "-"
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


    /* -------------------------------- */
    /* FORMAT RUPEES */
    /* -------------------------------- */

    const formatRupees = (amount) => {

        return `₹${Number(amount).toLocaleString(
            "en-IN"
        )}`

    }


    return (

        <div className="expenses-page">

            {/* PAGE HEADER */}

            <div className="expenses-page-heading">

                <div>

                    <p className="section-kicker">
                        ExpenseFlow / Ledger
                    </p>

                    <h1>
                        Expenses
                    </h1>

                    <p>
                        Track and manage your spending
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={onAddExpense}
                >
                    <Plus size={17} />

                    Add expense

                </button>

            </div>


            {/* SUMMARY */}

            <section className="expense-summary-grid">

                <div className="expense-summary-card">

                    <span>
                        Total expenses
                    </span>

                    <strong>
                        {formatRupees(total)}
                    </strong>

                    <small>
                        All recorded expenses
                    </small>

                </div>


                <div className="expense-summary-card">

                    <span>
                        Transactions
                    </span>

                    <strong>
                        {expenses.length}
                    </strong>

                    <small>
                        Recorded expenses
                    </small>

                </div>


                <div className="expense-summary-card">

                    <span>
                        Average expense
                    </span>

                    <strong>
                        {formatRupees(average)}
                    </strong>

                    <small>
                        Per transaction
                    </small>

                </div>

            </section>


            {/* FILTER TOOLBAR */}

            <section className="expense-toolbar">

                <div className="expense-search">

                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="expense-date-input">

                    <CalendarDays size={16} />

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                    />

                </div>


                <span className="date-to">
                    to
                </span>


                <div className="expense-date-input">

                    <CalendarDays size={16} />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                    />

                </div>


                <button
                    className="filter-button"
                    onClick={handleFilter}
                >

                    <Filter size={16} />

                    Filter

                </button>


                <button
                    className="clear-filter-button"
                    onClick={handleClearFilter}
                >
                    Clear
                </button>

            </section>


            {/* EXPENSE TABLE */}

            <section className="expenses-table-card">

                <div className="expenses-table-heading">

                    <div>

                        <h2>
                            All expenses
                        </h2>

                        <p>
                            {filteredExpenses.length} transactions
                        </p>

                    </div>

                </div>


                {filteredExpenses.length === 0 ? (

                    <div className="expense-empty">

                        <div className="expense-empty-icon">

                            <WalletCards size={25} />

                        </div>

                        <h3>
                            No expenses found
                        </h3>

                        <p>
                            Start tracking your spending by
                            adding your first expense.
                        </p>

                        <button
                            className="primary-button"
                            onClick={onAddExpense}
                        >

                            <Plus size={17} />

                            Add expense

                        </button>

                    </div>

                ) : (

                    <div className="expenses-table-wrapper">

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

                                    <th className="amount-heading">
                                        Amount
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredExpenses.map(
                                    expense => (

                                        <tr
                                            key={expense.id}
                                        >

                                            <td>

                                                <span className="expense-description">
                                                    {expense.description}
                                                </span>

                                            </td>


                                            <td>

                                                <span className="expense-category">

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

                                                {formatRupees(
                                                    expense.amount
                                                )}

                                            </td>


                                            <td>

                                                <button
                                                    className="expense-delete-button"
                                                    onClick={() =>
                                                        setDeleteItem(
                                                            expense
                                                        )
                                                    }
                                                    aria-label="Delete expense"
                                                >

                                                    <Trash2
                                                        size={17}
                                                    />

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* DELETE MODAL */}

            {deleteItem && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <button
                            className="delete-modal-close"
                            onClick={() =>
                                setDeleteItem(null)
                            }
                        >

                            <X size={18} />

                        </button>


                        <div className="delete-modal-icon">

                            <Trash2 size={23} />

                        </div>


                        <h2>
                            Delete this expense?
                        </h2>


                        <p>

                            Are you sure you want to
                            delete{" "}

                            <strong>
                                {deleteItem.description}
                            </strong>

                            ?

                            <br />

                            This action cannot be undone.

                        </p>


                        <div className="delete-modal-actions">

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setDeleteItem(null)
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                className="danger-button"
                                onClick={handleDelete}
                                disabled={loading}
                            >

                                <Trash2 size={16} />

                                {loading
                                    ? "Deleting..."
                                    : "Delete expense"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )
}

export default ExpensesPage