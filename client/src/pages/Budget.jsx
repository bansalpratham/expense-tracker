import { useEffect, useState } from "react"
import {
    AlertCircle,
    Check,
    CreditCard,
    LoaderCircle,
    Pencil,
    Plus,
    Trash2,
    Wallet,
    X
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"

import {
    getBudget,
    addBudget,
    updateBudget,
    deleteBudget
} from "../redux/slices/budgetSlice"


const money = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}


function BudgetCard({
    type,
    budget,
    onEdit,
    onDelete
}) {

    const label =
        type[0].toUpperCase() + type.slice(1)

    return (

        <article className="budget-card">

            <div className="budget-card-heading">

                <div className="budget-card-icon">
                    <Wallet />
                </div>

                <div className="budget-card-actions">

                    {budget && (
                        <>

                            <button
                                className="budget-icon-button"
                                aria-label={`Edit ${type} budget`}
                                onClick={onEdit}
                            >
                                <Pencil />
                            </button>

                            <button
                                className="budget-icon-button danger"
                                aria-label={`Delete ${type} budget`}
                                onClick={onDelete}
                            >
                                <Trash2 />
                            </button>

                        </>
                    )}

                </div>

            </div>


            <p className="budget-card-label">
                {label} Budget
            </p>


            {budget ? (

                <>

                    <strong className="budget-amount">
                        {money(budget.amount)}
                    </strong>


                    <div className="budget-bottom">

                        <span>
                            Budget limit
                            <b>
                                {money(budget.amount)}
                            </b>
                        </span>

                        <button
                            className="text-button"
                            onClick={onEdit}
                        >
                            Edit budget
                            <Pencil />
                        </button>

                    </div>

                </>

            ) : (

                <div className="budget-empty">

                    <span>
                        No {type} budget set
                    </span>

                    <button
                        className="primary-button"
                        onClick={onEdit}
                    >
                        <Plus />
                        Set budget
                    </button>

                </div>

            )}

        </article>

    )
}


function BudgetModal({
    initial,
    saving,
    onClose,
    onSubmit
}) {

    const [amount, setAmount] = useState(
        initial ? String(initial.amount) : ""
    )

    const [type, setType] = useState(
        initial?.type || "monthly"
    )

    const [error, setError] = useState("")


    const submit = (event) => {

        event.preventDefault()

        const numericAmount = Number(amount)

        if (!numericAmount || numericAmount <= 0) {

            setError(
                "Enter an amount greater than zero."
            )

            return
        }

        onSubmit({
            amount: numericAmount,
            type
        })

    }


    return (

        <div
            className="budget-modal-backdrop"
            role="presentation"
        >

            <form
                className="budget-modal"
                onSubmit={submit}
            >

                <button
                    type="button"
                    className="form-close-button"
                    aria-label="Close modal"
                    onClick={onClose}
                    disabled={saving}
                >
                    <X />
                </button>


                <div className="budget-modal-icon">
                    <CreditCard />
                </div>


                <h2>
                    {initial
                        ? "Edit budget"
                        : "Set a budget"
                    }
                </h2>


                <p>
                    {initial
                        ? "Update your spending limit."
                        : "Create a spending limit to stay on track."
                    }
                </p>


                <label className="budget-field">

                    <span>
                        Budget type
                    </span>

                    <select
                        value={type}
                        onChange={(event) =>
                            setType(event.target.value)
                        }
                        disabled={Boolean(initial) || saving}
                    >

                        <option value="weekly">
                            Weekly
                        </option>

                        <option value="monthly">
                            Monthly
                        </option>

                    </select>

                </label>


                <label className="budget-field">

                    <span>
                        Amount
                    </span>

                    <div className="input-with-prefix">

                        <span>
                            ₹
                        </span>

                        <input
                            autoFocus
                            value={amount}
                            onChange={(event) => {

                                setAmount(event.target.value)

                                setError("")

                            }}
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            disabled={saving}
                        />

                    </div>

                </label>


                {error && (

                    <p
                        className="budget-form-error"
                        role="alert"
                    >
                        <AlertCircle />
                        {error}
                    </p>

                )}


                <div className="budget-modal-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >

                        {saving && (
                            <LoaderCircle className="spin" />
                        )}

                        {saving
                            ? "Saving..."
                            : "Save budget"
                        }

                    </button>

                </div>

            </form>

        </div>

    )
}


function DeleteBudgetModal({
    budget,
    deleting,
    onClose,
    onDelete
}) {

    if (!budget) {
        return null
    }


    return (

        <div className="budget-modal-backdrop">

            <div className="budget-modal compact">

                <button
                    className="form-close-button"
                    aria-label="Close modal"
                    onClick={onClose}
                    disabled={deleting}
                >
                    <X />
                </button>


                <div className="budget-modal-icon danger-icon">
                    <Trash2 />
                </div>


                <h2>
                    Delete this budget?
                </h2>


                <p>
                    Are you sure you want to remove your{" "}
                    {budget.type} budget?
                </p>


                <div className="budget-modal-actions">

                    <button
                        className="secondary-button"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>


                    <button
                        className="danger-button"
                        disabled={deleting}
                        onClick={onDelete}
                    >

                        {deleting
                            ? "Deleting..."
                            : "Delete budget"
                        }

                    </button>

                </div>

            </div>

        </div>

    )
}


function Budget() {

    const dispatch = useDispatch()


    const {
        weekly,
        monthly
    } = useSelector(
        (state) => state.budget
    )


    const [modal, setModal] = useState(null)

    const [deleteTarget, setDeleteTarget] =
        useState(null)

    const [saving, setSaving] =
        useState(false)

    const [deleting, setDeleting] =
        useState(false)

    const [error, setError] =
        useState("")


    useEffect(() => {

        dispatch(getBudget())

    }, [dispatch])


    const budgets = {
        weekly:
            weekly && weekly !== 0
                ? weekly
                : null,

        monthly:
            monthly && monthly !== 0
                ? monthly
                : null
    }


    const activeBudget =
        modal
            ? budgets[modal]
            : null


    const handleSubmit = async ({
        amount,
        type
    }) => {

        try {

            setSaving(true)

            setError("")


            if (activeBudget) {

                await dispatch(
                    updateBudget({
                        budgetId: activeBudget.id,
                        amount
                    })
                ).unwrap()

            } else {

                await dispatch(
                    addBudget({
                        amount,
                        type
                    })
                ).unwrap()

            }


            setModal(null)

        } catch (error) {

            setError(
                typeof error === "string"
                    ? error
                    : "Something went wrong while saving the budget."
            )

        } finally {

            setSaving(false)

        }

    }


    const handleDelete = async () => {

        if (!deleteTarget) {
            return
        }


        try {

            setDeleting(true)

            setError("")


            await dispatch(
                deleteBudget(
                    deleteTarget.id
                )
            ).unwrap()


            setDeleteTarget(null)

        } catch (error) {

            setError(
                typeof error === "string"
                    ? error
                    : "Something went wrong while deleting the budget."
            )

        } finally {

            setDeleting(false)

        }

    }


    return (

        <main className="budget-page">

            {/* HEADER */}

            <div className="budget-page-heading">

                <div>

                    <p className="section-kicker">
                        Financial planning
                    </p>

                    <h1>
                        Budget Management
                    </h1>

                    <p>
                        Set and manage your weekly and monthly
                        spending limits.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() => setModal("monthly")}
                >
                    <Plus />
                    Set budget
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="budget-error"
                    role="alert"
                >

                    <AlertCircle />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() => setError("")}
                    >
                        Dismiss
                    </button>

                </div>

            )}


            {/* BUDGET CARDS */}

            <div className="budget-grid">

                <BudgetCard
                    type="weekly"
                    budget={budgets.weekly}
                    onEdit={() =>
                        setModal("weekly")
                    }
                    onDelete={() =>
                        setDeleteTarget(
                            budgets.weekly
                        )
                    }
                />


                <BudgetCard
                    type="monthly"
                    budget={budgets.monthly}
                    onEdit={() =>
                        setModal("monthly")
                    }
                    onDelete={() =>
                        setDeleteTarget(
                            budgets.monthly
                        )
                    }
                />

            </div>


            {/* GUIDANCE */}

            {!budgets.weekly &&
                !budgets.monthly && (

                    <div className="budget-guidance">

                        <Check />

                        <div>

                            <strong>
                                Start with a simple limit
                            </strong>

                            <p>
                                Set a weekly or monthly budget
                                to make your spending easier
                                to understand.
                            </p>

                        </div>

                    </div>

                )}


            {/* ADD / EDIT MODAL */}

            {modal && (

                <BudgetModal
                    initial={activeBudget}
                    saving={saving}
                    onClose={() =>
                        setModal(null)
                    }
                    onSubmit={handleSubmit}
                />

            )}


            {/* DELETE MODAL */}

            {deleteTarget && (

                <DeleteBudgetModal
                    budget={deleteTarget}
                    deleting={deleting}
                    onClose={() =>
                        setDeleteTarget(null)
                    }
                    onDelete={handleDelete}
                />

            )}

        </main>

    )
}


export default Budget