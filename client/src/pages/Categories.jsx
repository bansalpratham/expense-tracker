import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    Plus,
    Tag,
    Trash2,
    BarChart3,
    LayoutDashboard,
    Receipt,
    Wallet,
    X,
    Check,
    Loader2
} from "lucide-react"

import {
    getCategories,
    addCategory,
    deleteCategory,
    getCategorySpending
} from "../redux/slices/categorySlice"

import { useNavigate } from "react-router-dom"

function Categories() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { categories, categorySpending } = useSelector(
        (state) => state.category
    )

    const [showForm, setShowForm] = useState(false)
    const [categoryName, setCategoryName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        dispatch(getCategories())
        dispatch(getCategorySpending())

    }, [dispatch])


    const handleAddCategory = async (e) => {

    e.preventDefault()

    if (!categoryName.trim()) {
        return
    }

    setLoading(true)

    try {

        await dispatch(
            addCategory(categoryName.trim())
        ).unwrap()


        // Refresh category spending
        await dispatch(
            getCategorySpending()
        ).unwrap()


        setCategoryName("")

        setShowForm(false)

    } catch (error) {

        console.error(
            "Failed to add category:",
            error
        )

    } finally {

        setLoading(false)

    }
}


    const handleDeleteCategory = async (id) => {

    try {

        await dispatch(
            deleteCategory(id)
        ).unwrap()


        await dispatch(
            getCategorySpending()
        ).unwrap()

    } catch (error) {

        console.error(
            "Failed to delete category:",
            error
        )

    }
}


    return (

        <div className="categories-page">

            {/* SIDEBAR */}

            <aside className="categories-sidebar">

                <div className="categories-logo">

                    <div className="categories-logo-icon">
                        ₹
                    </div>

                    <span>
                        Expense<span>Flow</span>
                    </span>

                </div>


                <nav className="categories-nav">

                    <button
                        onClick={() => navigate("/home")}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>


                    <button
                        onClick={() => navigate("/expenses")}
                    >
                        <Receipt size={20} />
                        Expenses

                        {categories.length > 0 && (
                            <span className="nav-count">
                                {categories.length}
                            </span>
                        )}

                    </button>


                    <button
                        className="active"
                    >
                        <Tag size={20} />
                        Categories
                    </button>


                    <button
                        onClick={() => navigate("/budget")}
                    >
                        <Wallet size={20} />
                        Budgets
                    </button>

                </nav>

            </aside>


            {/* MAIN */}

            <main className="categories-main">

                {/* HEADER */}

                <header className="categories-header">

                    <div>

                        <p className="categories-breadcrumb">
                            ExpenseFlow
                        </p>

                        <h1>
                            Categories
                        </h1>

                        <p>
                            Organize your expenses and see where your money goes.
                        </p>

                    </div>

                    <button
                        className="categories-primary-btn"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={18} />
                        Add category
                    </button>

                </header>


                {/* ADD CATEGORY FORM */}

                {showForm && (

                    <section className="category-form-card">

                        <div className="category-form-header">

                            <div>

                                <p className="small-heading">
                                    BUILD YOUR SYSTEM
                                </p>

                                <h2>
                                    Add a category
                                </h2>

                                <p>
                                    Keep spending organized with categories that fit your life.
                                </p>

                            </div>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false)
                                    setCategoryName("")
                                }}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form onSubmit={handleAddCategory}>

                            <label>
                                Category name
                            </label>

                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) =>
                                    setCategoryName(e.target.value)
                                }
                                placeholder="e.g. Food"
                                maxLength={50}
                                disabled={loading}
                            />


                            <div className="category-form-actions">

                                <button
                                    type="button"
                                    className="category-cancel-btn"
                                    onClick={() => {
                                        setShowForm(false)
                                        setCategoryName("")
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="categories-primary-btn"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="spin"
                                            />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={17} />
                                            Add category
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* CATEGORY LIST */}

                <section className="category-section">

                    <div className="section-title">

                        <div>

                            <p className="small-heading">
                                YOUR FINANCIAL SYSTEM
                            </p>

                            <h2>
                                Your categories
                            </h2>

                            <p>
                                Manage the categories used for your expenses.
                            </p>

                        </div>

                        <div className="category-total">
                            {categories.length}
                            <span>categories</span>
                        </div>

                    </div>


                    {categories.length === 0 ? (

                        <div className="empty-category-card">

                            <div className="empty-icon">
                                <Tag size={26} />
                            </div>

                            <h3>
                                No categories yet
                            </h3>

                            <p>
                                Create your first category to organize your expenses.
                            </p>

                            <button
                                className="category-outline-btn"
                                onClick={() => setShowForm(true)}
                            >
                                <Plus size={18} />
                                Add category
                            </button>

                        </div>

                    ) : (

                        <div className="category-grid">

                           {categorySpending.map((item) => (

    <div
        className="spending-row"
        key={item.id}
    >

        <span>
            {item.name}
        </span>

        <strong>
            ₹
            {Number(
                item.total_spending || 0
            ).toFixed(2)}
        </strong>

    </div>

))}

                        </div>

                    )}

                </section>


                {/* SPENDING */}

                <section className="spending-card">

                    <div className="spending-header">

                        <div>

                            <div className="spending-title">

                                <BarChart3 size={21} />

                                <h2>
                                    Spending by category
                                </h2>

                            </div>

                            <p>
                                A view of your current category totals.
                            </p>

                        </div>

                    </div>


                    {categorySpending.length === 0 ? (

                        <div className="no-spending">
                            No spending data available yet.
                        </div>

                    ) : (

                        <div className="spending-list">

                            {categorySpending.map((item, index) => (

                                <div
                                    className="spending-row"
                                    key={item.category_id || item.categoryId || index}
                                >

                                    <span>
                                        {item.category_name ||
                                            item.name ||
                                            "Category"}
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            item.total ||
                                            item.spending ||
                                            0
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>


            {/* PAGE STYLES */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .categories-page {
                    min-height: 100vh;
                    background: #06110d;
                    color: #f4f7f5;
                    display: flex;
                    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }


                /* SIDEBAR */

                .categories-sidebar {
                    width: 272px;
                    min-height: 100vh;
                    background: #071610;
                    border-right: 1px solid #183329;
                    position: fixed;
                    left: 0;
                    top: 0;
                    bottom: 0;
                }


                .categories-logo {
                    height: 94px;
                    display: flex;
                    align-items: center;
                    padding: 0 24px;
                    border-bottom: 1px solid #10271e;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.4px;
                }


                .categories-logo span span {
                    color: #31d6a0;
                }


                .categories-logo-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    background: #35d8a4;
                    color: #062017;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    margin-right: 12px;
                }


                .categories-nav {
                    padding: 24px 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }


                .categories-nav button {
                    width: 100%;
                    border: none;
                    background: transparent;
                    color: #8ba49b;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 15px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 14px;
                    text-align: left;
                    transition: 0.2s;
                }


                .categories-nav button:hover {
                    background: #0c241b;
                    color: #e9f5ef;
                }


                .categories-nav button.active {
                    background: #0c3025;
                    color: #f4fffa;
                    box-shadow: inset 2px 0 0 #32d8a2;
                }


                .nav-count {
                    margin-left: auto;
                    min-width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #0b3a2a;
                    color: #39dca5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                }


                /* MAIN */

                .categories-main {
                    margin-left: 272px;
                    width: calc(100% - 272px);
                    min-height: 100vh;
                    padding: 48px 52px 80px;
                }


                .categories-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding-bottom: 34px;
                    border-bottom: 1px solid #10271e;
                    margin-bottom: 34px;
                }


                .categories-breadcrumb {
                    color: #31d8a0;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-size: 11px;
                    font-weight: 700;
                    margin: 0 0 8px;
                }


                .categories-header h1 {
                    margin: 0;
                    font-size: 32px;
                    letter-spacing: -1px;
                }


                .categories-header p:not(.categories-breadcrumb) {
                    margin: 8px 0 0;
                    color: #79928a;
                    font-size: 14px;
                }


                .categories-primary-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border: none;
                    background: #32d7a1;
                    color: #062117;
                    font-weight: 700;
                    padding: 12px 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: 0.2s;
                }


                .categories-primary-btn:hover {
                    background: #48e3b1;
                    transform: translateY(-1px);
                }


                .categories-primary-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }


                /* FORM */

                .category-form-card {
                    background: #0a1d16;
                    border: 1px solid #1b3a2f;
                    border-radius: 18px;
                    padding: 28px;
                    margin-bottom: 34px;
                    max-width: 720px;
                }


                .category-form-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 26px;
                }


                .small-heading {
                    margin: 0 0 8px;
                    color: #31d8a0;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.4px;
                    text-transform: uppercase;
                }


                .category-form-header h2,
                .section-title h2 {
                    margin: 0;
                    font-size: 21px;
                }


                .category-form-header p:last-child,
                .section-title p:last-child {
                    color: #789289;
                    font-size: 13px;
                    margin: 8px 0 0;
                }


                .close-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 9px;
                    border: 1px solid #234338;
                    background: transparent;
                    color: #91aaa1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }


                .close-btn:hover {
                    background: #132b22;
                    color: white;
                }


                .category-form-card form {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }


                .category-form-card label {
                    font-size: 13px;
                    color: #a9beb7;
                }


                .category-form-card input {
                    width: 100%;
                    background: #07140f;
                    border: 1px solid #29463c;
                    color: #f1f7f4;
                    border-radius: 10px;
                    padding: 13px 14px;
                    outline: none;
                    font-size: 14px;
                    margin-top: 2px;
                }


                .category-form-card input:focus {
                    border-color: #31d8a0;
                    box-shadow: 0 0 0 3px rgba(49, 216, 160, 0.1);
                }


                .category-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 12px;
                }


                .category-cancel-btn {
                    border: 1px solid #29463c;
                    background: transparent;
                    color: #9bb0a8;
                    border-radius: 10px;
                    padding: 11px 17px;
                    cursor: pointer;
                }


                /* CATEGORIES */

                .category-section {
                    margin-bottom: 34px;
                }


                .section-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 18px;
                }


                .category-total {
                    color: #e8f3ee;
                    font-size: 24px;
                    font-weight: 700;
                    text-align: right;
                }


                .category-total span {
                    display: block;
                    color: #6e887e;
                    font-size: 11px;
                    font-weight: 400;
                    margin-top: 2px;
                }


                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                }


                .category-card {
                    background: #0a1d16;
                    border: 1px solid #1b3a2f;
                    border-radius: 16px;
                    padding: 20px;
                    transition: 0.2s;
                }


                .category-card:hover {
                    border-color: #2b5948;
                    transform: translateY(-2px);
                }


                .category-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }


                .category-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 11px;
                    background: #0c3025;
                    color: #35d8a4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }


                .delete-category-btn {
                    border: none;
                    background: transparent;
                    color: #617b71;
                    cursor: pointer;
                    padding: 7px;
                    border-radius: 8px;
                }


                .delete-category-btn:hover {
                    background: #321c1c;
                    color: #ff7777;
                }


                .category-card h3 {
                    margin: 20px 0 22px;
                    font-size: 17px;
                    color: #f0f7f4;
                }


                .category-spending {
                    border-top: 1px solid #173128;
                    padding-top: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }


                .category-spending span {
                    color: #708980;
                    font-size: 12px;
                }


                .category-spending strong {
                    color: #dcece6;
                    font-size: 15px;
                }


                /* EMPTY */

                .empty-category-card {
                    border: 1px dashed #29473c;
                    border-radius: 16px;
                    padding: 48px 20px;
                    text-align: center;
                    background: #081811;
                }


                .empty-icon {
                    width: 54px;
                    height: 54px;
                    border-radius: 14px;
                    background: #0c3025;
                    color: #32d7a1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 18px;
                }


                .empty-category-card h3 {
                    margin: 0;
                    font-size: 17px;
                }


                .empty-category-card p {
                    color: #748d84;
                    font-size: 13px;
                    margin: 8px 0 20px;
                }


                .category-outline-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: 1px solid #315146;
                    color: #b9cec7;
                    border-radius: 9px;
                    padding: 10px 15px;
                    cursor: pointer;
                }


                .category-outline-btn:hover {
                    border-color: #32d7a1;
                    color: #32d7a1;
                }


                /* SPENDING */

                .spending-card {
                    background: #0a1d16;
                    border: 1px solid #1b3a2f;
                    border-radius: 17px;
                    padding: 25px;
                }


                .spending-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #e9f5f0;
                }


                .spending-title svg {
                    color: #35d8a4;
                }


                .spending-title h2 {
                    margin: 0;
                    font-size: 17px;
                }


                .spending-header p {
                    color: #748d84;
                    font-size: 12px;
                    margin: 7px 0 0;
                }


                .no-spending {
                    margin-top: 24px;
                    padding: 24px;
                    border-radius: 10px;
                    background: #07140f;
                    color: #708980;
                    text-align: center;
                    font-size: 13px;
                }


                .spending-list {
                    margin-top: 22px;
                }


                .spending-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 4px;
                    border-bottom: 1px solid #173128;
                    color: #a9bbb5;
                    font-size: 13px;
                }


                .spending-row strong {
                    color: #e8f3ee;
                }


                .spin {
                    animation: spin 0.8s linear infinite;
                }


                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }


                /* RESPONSIVE */

                @media (max-width: 1000px) {

                    .categories-sidebar {
                        width: 220px;
                    }

                    .categories-main {
                        margin-left: 220px;
                        width: calc(100% - 220px);
                        padding: 35px 30px;
                    }

                    .category-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                }


                @media (max-width: 700px) {

                    .categories-sidebar {
                        position: static;
                        width: 100%;
                        min-height: auto;
                    }

                    .categories-page {
                        flex-direction: column;
                    }

                    .categories-nav {
                        flex-direction: row;
                        overflow-x: auto;
                    }

                    .categories-nav button {
                        white-space: nowrap;
                    }

                    .categories-main {
                        margin-left: 0;
                        width: 100%;
                        padding: 25px 18px;
                    }

                    .categories-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .category-grid {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>

        </div>
    )
}

export default Categories