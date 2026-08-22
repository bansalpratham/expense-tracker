import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    WalletCards,
    CalendarDays,
    Pencil,
    Trash2,
    Plus,
    X,
    Check,
    ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    getBudget,
    addBudget,
    updateBudget,
    deleteBudget
} from "../redux/slices/budgetSlice"

function Budget() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { weekly, monthly } = useSelector(
        (state) => state.budget
    )

    const [showModal, setShowModal] = useState(false)
    const [selectedType, setSelectedType] = useState("")
    const [amount, setAmount] = useState("")
    const [editingBudget, setEditingBudget] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dispatch(getBudget())
    }, [dispatch])


    const openAddModal = (type) => {

        setSelectedType(type)
        setEditingBudget(null)
        setAmount("")
        setShowModal(true)
    }


    const openEditModal = (budget) => {

        setSelectedType(budget.type)
        setEditingBudget(budget)
        setAmount(budget.amount)
        setShowModal(true)
    }


    const closeModal = () => {

        if (loading) return

        setShowModal(false)
        setSelectedType("")
        setAmount("")
        setEditingBudget(null)
    }


    const handleSubmit = async (event) => {

        event.preventDefault()

        if (!amount || Number(amount) <= 0) {
            return
        }

        setLoading(true)

        try {

            if (editingBudget) {

                await dispatch(
                    updateBudget({
                        budgetId: editingBudget.id,
                        amount: Number(amount)
                    })
                ).unwrap()

            } else {

                await dispatch(
                    addBudget({
                        amount: Number(amount),
                        type: selectedType
                    })
                ).unwrap()

            }

            closeModal()

        } catch (error) {

            console.error(error)

            alert(
                typeof error === "string"
                    ? error
                    : "Something went wrong"
            )

        } finally {

            setLoading(false)

        }
    }


    const handleDelete = async (budget) => {

        const confirmDelete = window.confirm(
            `Delete your ${budget.type} budget?`
        )

        if (!confirmDelete) return

        try {

            await dispatch(
                deleteBudget(budget.id)
            ).unwrap()

        } catch (error) {

            console.error(error)

            alert(
                typeof error === "string"
                    ? error
                    : "Unable to delete budget"
            )
        }
    }


    const formatAmount = (amount) => {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(Number(amount || 0))
    }


    const BudgetCard = ({
        type,
        budget,
        icon
    }) => {

        const exists =
            budget &&
            typeof budget === "object" &&
            budget.id

        return (

            <div className="budget-card">

                <div className="budget-card-top">

                    <div className={`budget-icon ${type}`}>

                        {icon}

                    </div>

                    <div className="budget-card-heading">

                        <span>
                            {type === "weekly"
                                ? "Weekly Budget"
                                : "Monthly Budget"}
                        </span>

                        <small>
                            {type === "weekly"
                                ? "Your spending limit for this week"
                                : "Your spending limit for this month"}
                        </small>

                    </div>

                </div>


                {exists ? (

                    <>

                        <div className="budget-amount">

                            {formatAmount(budget.amount)}

                        </div>

                        <div className="budget-status">

                            <span className="status-dot"></span>

                            Budget is active

                        </div>


                        <div className="budget-card-actions">

                            <button
                                className="edit-budget-btn"
                                onClick={() =>
                                    openEditModal(budget)
                                }
                            >

                                <Pencil size={16} />

                                Edit

                            </button>


                            <button
                                className="delete-budget-btn"
                                onClick={() =>
                                    handleDelete(budget)
                                }
                            >

                                <Trash2 size={16} />

                                Delete

                            </button>

                        </div>

                    </>

                ) : (

                    <div className="empty-budget">

                        <div className="empty-budget-icon">

                            <WalletCards size={24} />

                        </div>

                        <p>
                            No {type} budget set
                        </p>

                        <span>
                            Create a limit to keep your
                            spending under control.
                        </span>

                        <button
                            className="set-budget-btn"
                            onClick={() =>
                                openAddModal(type)
                            }
                        >

                            <Plus size={17} />

                            Set budget

                        </button>

                    </div>

                )}

            </div>
        )
    }


    return (

        <div className="budget-page">

            {/* SIDEBAR */}

            <aside className="budget-sidebar">

                <div className="budget-logo">

                    <div className="logo-icon">

                        <WalletCards size={21} />

                    </div>

                    <span>
                        Expense<span>Flow</span>
                    </span>

                </div>


                <nav className="budget-navigation">

                    <button
                        onClick={() => navigate("/home")}
                    >
                        <WalletCards size={19} />
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/expenses")}
                    >
                        <CalendarDays size={19} />
                        Expenses
                    </button>

                    <button
                        onClick={() => navigate("/categories")}
                    >
                        <WalletCards size={19} />
                        Categories
                    </button>

                    <button className="active">

                        <WalletCards size={19} />

                        Budgets

                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <div className="sidebar-help">

                        <span>
                            Stay in control
                        </span>

                        <p>
                            Set realistic limits and
                            track your spending.
                        </p>

                    </div>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="budget-main">

                <header className="budget-header">

                    <div>

                        <button
                            className="back-button"
                            onClick={() =>
                                navigate("/home")
                            }
                        >

                            <ArrowLeft size={17} />

                            Dashboard

                        </button>

                        <p className="page-kicker">
                            FINANCIAL PLANNING
                        </p>

                        <h1>
                            Budget Management
                        </h1>

                        <p className="page-description">
                            Set and manage your weekly and
                            monthly spending limits.
                        </p>

                    </div>


                    <button
                        className="header-set-budget"
                        onClick={() => openAddModal("monthly")}
                    >

                        <Plus size={18} />

                        Set budget

                    </button>

                </header>


                {/* SUMMARY */}

                <section className="budget-summary">

                    <div className="summary-card">

                        <div className="summary-icon">

                            <WalletCards size={20} />

                        </div>

                        <div>

                            <span>
                                Weekly limit
                            </span>

                            <strong>
                                {weekly?.amount
                                    ? formatAmount(weekly.amount)
                                    : "Not set"}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon">

                            <CalendarDays size={20} />

                        </div>

                        <div>

                            <span>
                                Monthly limit
                            </span>

                            <strong>
                                {monthly?.amount
                                    ? formatAmount(monthly.amount)
                                    : "Not set"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* BUDGET CARDS */}

                <section className="budget-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Your budgets
                            </h2>

                            <p>
                                Manage your spending limits
                                from one place.
                            </p>

                        </div>

                    </div>


                    <div className="budget-grid">

                        <BudgetCard
                            type="weekly"
                            budget={weekly}
                            icon={
                                <CalendarDays size={22} />
                            }
                        />


                        <BudgetCard
                            type="monthly"
                            budget={monthly}
                            icon={
                                <WalletCards size={22} />
                            }
                        />

                    </div>

                </section>


                {/* INFO */}

                <section className="budget-info">

                    <div className="info-check">

                        <Check size={18} />

                    </div>

                    <div>

                        <h3>
                            Start with a simple limit
                        </h3>

                        <p>
                            Set a weekly or monthly budget
                            to make your spending easier to
                            understand and control.
                        </p>

                    </div>

                </section>

            </main>


            {/* MODAL */}

            {showModal && (

                <div
                    className="budget-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal()
                        }

                    }}
                >

                    <div className="budget-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    {editingBudget
                                        ? "UPDATE BUDGET"
                                        : "NEW BUDGET"}
                                </span>

                                <h2>

                                    {editingBudget
                                        ? "Edit budget"
                                        : `Set ${selectedType} budget`}

                                </h2>

                            </div>


                            <button
                                className="modal-close"
                                onClick={closeModal}
                                disabled={loading}
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <label>

                                Budget amount

                                <div className="amount-input">

                                    <span>₹</span>

                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={amount}
                                        onChange={(event) =>
                                            setAmount(
                                                event.target.value
                                            )
                                        }
                                        placeholder="5000"
                                        autoFocus
                                        disabled={loading}
                                    />

                                </div>

                            </label>


                            {!editingBudget && (

                                <div className="type-selector">

                                    <button
                                        type="button"
                                        className={
                                            selectedType === "weekly"
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedType(
                                                "weekly"
                                            )
                                        }
                                    >

                                        <CalendarDays size={18} />

                                        Weekly

                                    </button>


                                    <button
                                        type="button"
                                        className={
                                            selectedType === "monthly"
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedType(
                                                "monthly"
                                            )
                                        }
                                    >

                                        <WalletCards size={18} />

                                        Monthly

                                    </button>

                                </div>

                            )}


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel"
                                    onClick={closeModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-submit"
                                    disabled={
                                        loading ||
                                        !amount ||
                                        Number(amount) <= 0
                                    }
                                >

                                    {loading
                                        ? "Saving..."
                                        : editingBudget
                                            ? "Update budget"
                                            : "Create budget"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* PAGE CSS */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .budget-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at 80% 10%,
                            rgba(32, 210, 160, 0.07),
                            transparent 28%
                        ),
                        #06110e;
                    color: #eefcf7;
                    display: flex;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                .budget-sidebar {
                    width: 250px;
                    min-height: 100vh;
                    background: #071713;
                    border-right: 1px solid #15322a;
                    padding: 28px 18px;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                }

                .budget-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 4px 2px 35px;
                    font-size: 19px;
                    font-weight: 800;
                    color: #f2fffb;
                }

                .budget-logo > span > span {
                    color: #32d6a0;
                }

                .logo-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                    background: #31d6a0;
                    color: #06110e;
                }

                .budget-navigation {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                .budget-navigation button {
                    border: 0;
                    background: transparent;
                    color: #8ca59e;
                    padding: 13px 13px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    font-size: 14px;
                    cursor: pointer;
                    text-align: left;
                    transition: 0.2s;
                }

                .budget-navigation button:hover {
                    background: #0b2820;
                    color: #e8faf4;
                }

                .budget-navigation button.active {
                    background: #0d3026;
                    color: #4ce2b1;
                    box-shadow:
                        inset 3px 0 0 #31d6a0;
                }

                .sidebar-bottom {
                    margin-top: auto;
                }

                .sidebar-help {
                    border: 1px solid #15372e;
                    background: #0a201a;
                    border-radius: 14px;
                    padding: 15px;
                }

                .sidebar-help span {
                    color: #36d5a0;
                    font-size: 12px;
                    font-weight: 700;
                }

                .sidebar-help p {
                    margin: 7px 0 0;
                    color: #769089;
                    font-size: 12px;
                    line-height: 1.5;
                }

                .budget-main {
                    flex: 1;
                    padding: 36px 48px 60px;
                    max-width: 1450px;
                    margin: 0 auto;
                    width: 100%;
                }

                .budget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 30px;
                    border-bottom: 1px solid #143028;
                    padding-bottom: 30px;
                }

                .back-button {
                    border: 0;
                    background: transparent;
                    color: #76948c;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 0;
                    margin-bottom: 22px;
                    cursor: pointer;
                    font-size: 13px;
                }

                .back-button:hover {
                    color: #43dcae;
                }

                .page-kicker {
                    margin: 0 0 8px;
                    color: #38d9a3;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                }

                .budget-header h1 {
                    margin: 0;
                    font-size: clamp(30px, 4vw, 43px);
                    letter-spacing: -0.04em;
                    color: #f3fffb;
                }

                .page-description {
                    margin: 10px 0 0;
                    color: #7e9991;
                    font-size: 15px;
                }

                .header-set-budget,
                .set-budget-btn,
                .modal-submit {
                    border: 0;
                    background: #31d6a0;
                    color: #06110e;
                    font-weight: 800;
                    border-radius: 10px;
                    padding: 12px 17px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .header-set-budget:hover,
                .set-budget-btn:hover,
                .modal-submit:hover {
                    background: #55e5b8;
                    transform: translateY(-1px);
                }

                .budget-summary {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                    margin: 28px 0 38px;
                }

                .summary-card {
                    background: linear-gradient(
                        135deg,
                        #0a211a,
                        #081a15
                    );
                    border: 1px solid #173a30;
                    border-radius: 15px;
                    padding: 21px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .summary-icon {
                    width: 43px;
                    height: 43px;
                    border-radius: 12px;
                    background: #0c3227;
                    color: #3ddbab;
                    display: grid;
                    place-items: center;
                }

                .summary-card span {
                    display: block;
                    color: #75918a;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .summary-card strong {
                    color: #effff9;
                    font-size: 21px;
                }

                .budget-section {
                    margin-top: 5px;
                }

                .section-heading h2 {
                    margin: 0;
                    font-size: 22px;
                }

                .section-heading p {
                    color: #78928b;
                    margin: 6px 0 20px;
                    font-size: 14px;
                }

                .budget-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 20px;
                }

                .budget-card {
                    min-height: 280px;
                    padding: 25px;
                    border: 1px solid #173a30;
                    background: linear-gradient(
                        145deg,
                        #0a211a,
                        #071812
                    );
                    border-radius: 18px;
                    position: relative;
                    overflow: hidden;
                }

                .budget-card::after {
                    content: "";
                    position: absolute;
                    width: 160px;
                    height: 160px;
                    right: -75px;
                    top: -75px;
                    border-radius: 50%;
                    background: rgba(42, 214, 160, 0.05);
                }

                .budget-card-top {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                }

                .budget-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    display: grid;
                    place-items: center;
                    color: #42dcae;
                    background: #0c3227;
                }

                .budget-card-heading span {
                    display: block;
                    font-size: 16px;
                    font-weight: 750;
                }

                .budget-card-heading small {
                    display: block;
                    color: #6e8981;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .budget-amount {
                    font-size: 37px;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    margin-top: 35px;
                }

                .budget-status {
                    margin-top: 10px;
                    color: #7eaaa0;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #32d6a0;
                }

                .budget-card-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 29px;
                }

                .edit-budget-btn,
                .delete-budget-btn {
                    padding: 9px 13px;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 13px;
                }

                .edit-budget-btn {
                    background: #0d3026;
                    color: #42dcae;
                    border: 1px solid #174b3c;
                }

                .delete-budget-btn {
                    background: transparent;
                    color: #bd817d;
                    border: 1px solid #452925;
                }

                .edit-budget-btn:hover {
                    background: #124033;
                }

                .delete-budget-btn:hover {
                    background: #241613;
                }

                .empty-budget {
                    margin-top: 28px;
                }

                .empty-budget-icon {
                    width: 43px;
                    height: 43px;
                    border-radius: 12px;
                    display: grid;
                    place-items: center;
                    background: #0a2b22;
                    color: #3ddbad;
                    margin-bottom: 13px;
                }

                .empty-budget p {
                    margin: 0;
                    font-size: 17px;
                    font-weight: 700;
                }

                .empty-budget span {
                    display: block;
                    margin: 7px 0 17px;
                    color: #708b83;
                    font-size: 13px;
                    max-width: 320px;
                    line-height: 1.5;
                }

                .budget-info {
                    margin-top: 24px;
                    border: 1px solid #17372e;
                    background: #081c16;
                    border-radius: 15px;
                    padding: 18px 20px;
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                }

                .info-check {
                    width: 34px;
                    height: 34px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    background: #0d3328;
                    color: #43dcad;
                    display: grid;
                    place-items: center;
                }

                .budget-info h3 {
                    margin: 1px 0 5px;
                    font-size: 14px;
                }

                .budget-info p {
                    margin: 0;
                    color: #728d85;
                    font-size: 13px;
                }

                .budget-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                    background: rgba(1, 8, 6, 0.78);
                    backdrop-filter: blur(8px);
                    display: grid;
                    place-items: center;
                    padding: 20px;
                }

                .budget-modal {
                    width: min(460px, 100%);
                    background: #0a1d17;
                    border: 1px solid #21483b;
                    border-radius: 18px;
                    padding: 25px;
                    box-shadow:
                        0 25px 80px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }

                .modal-header span {
                    color: #36d8a2;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                }

                .modal-header h2 {
                    margin: 7px 0 0;
                    font-size: 23px;
                }

                .modal-close {
                    border: 0;
                    background: #102b23;
                    color: #8ba59e;
                    width: 35px;
                    height: 35px;
                    border-radius: 9px;
                    display: grid;
                    place-items: center;
                    cursor: pointer;
                }

                .budget-modal label {
                    display: block;
                    color: #b6c9c3;
                    font-size: 13px;
                    font-weight: 700;
                }

                .amount-input {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;
                    background: #071510;
                    border: 1px solid #1b4235;
                    border-radius: 11px;
                    overflow: hidden;
                }

                .amount-input span {
                    padding-left: 15px;
                    color: #35d8a2;
                    font-weight: 800;
                }

                .amount-input input {
                    width: 100%;
                    border: 0;
                    outline: 0;
                    background: transparent;
                    color: #effff9;
                    padding: 14px 14px 14px 8px;
                    font-size: 19px;
                }

                .type-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 15px;
                }

                .type-selector button {
                    border: 1px solid #1b4235;
                    background: #071711;
                    color: #819c94;
                    padding: 12px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .type-selector button.selected {
                    border-color: #32d6a0;
                    background: #0d3328;
                    color: #3ee0ad;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 25px;
                }

                .modal-cancel {
                    border: 1px solid #214238;
                    background: transparent;
                    color: #8fa8a1;
                    padding: 11px 16px;
                    border-radius: 9px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .modal-submit:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                    transform: none;
                }

                @media (max-width: 900px) {

                    .budget-sidebar {
                        width: 205px;
                    }

                    .budget-main {
                        padding: 28px;
                    }

                    .budget-grid {
                        grid-template-columns: 1fr;
                    }

                }

                @media (max-width: 650px) {

                    .budget-sidebar {
                        display: none;
                    }

                    .budget-main {
                        padding: 22px 16px 40px;
                    }

                    .budget-header {
                        display: block;
                    }

                    .header-set-budget {
                        margin-top: 20px;
                    }

                    .budget-summary {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>

        </div>
    )
}

export default Budget