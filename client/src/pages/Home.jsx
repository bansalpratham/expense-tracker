import { useEffect, useMemo, useState } from "react"

import {
    ArrowDownRight,
    ArrowUpRight,
    Bell,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    FileText,
    LayoutDashboard,
    Menu,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Tags,
    Trash2,
    TrendingUp,
    Wallet,
    X
} from "lucide-react"

import {
    Area,
    AreaChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

import { useDispatch, useSelector } from "react-redux"

import AddExpenseForm from "../components/AddExpenseForm"

import {
    getDashboard
} from "../redux/slices/dashboardSlice"

import {
    getExpenses,
    addExpense,
    deleteExpense
} from "../redux/slices/expenseSlice"

import {
    getCategories,
    getCategorySpending
} from "../redux/slices/categorySlice"

import {
    getBudget
} from "../redux/slices/budgetSlice"


function MetricCard({
    label,
    value,
    change,
    positive,
    icon: Icon
}) {

    return (

        <div className="metric-card">

            <div className="flex items-start justify-between">

                <span className="metric-label">
                    {label}
                </span>

                <span className="metric-icon">
                    <Icon />
                </span>

            </div>

            <div className="mt-5 flex items-end justify-between gap-3">

                <strong className="metric-value">
                    {value}
                </strong>

                {change && (
                    <span
                        className={
                            positive
                                ? "change positive"
                                : "change negative"
                        }
                    >

                        {positive ? (
                            <ArrowUpRight />
                        ) : (
                            <ArrowDownRight />
                        )}

                        {change}

                    </span>
                )}

            </div>

        </div>
    )
}


function Home() {

    const dispatch = useDispatch()

    /*
        ============================
        REDUX STATE
        ============================
    */

    const dashboard = useSelector(
        (state) => state.dashboard
    )

    const expenses = useSelector(
        (state) => state.expense.expenses
    )

    const categories = useSelector(
        (state) => state.category.categories
    )

    const categorySpending = useSelector(
        (state) => state.category.categorySpending
    )


    /*
        ============================
        LOCAL UI STATE
        ============================
    */

    const [menuOpen, setMenuOpen] = useState(false)

    const [active, setActive] = useState("Dashboard")

    const [notice, setNotice] = useState("")

    const [formOpen, setFormOpen] = useState(false)

    const [loading, setLoading] = useState(false)


    /*
        ============================
        LOAD DATA
        ============================
    */

    useEffect(() => {

        dispatch(getDashboard())

        dispatch(getExpenses())

        dispatch(getCategories())

        dispatch(getCategorySpending())

        dispatch(getBudget())

    }, [dispatch])


    /*
        ============================
        TOAST
        ============================
    */

    const showNotice = (message) => {

        setNotice(message)

        window.setTimeout(() => {
            setNotice("")
        }, 2400)

    }


    /*
        ============================
        ADD EXPENSE
        ============================
    */

    const handleAddExpense = async (values) => {

        try {

            setLoading(true)

            await dispatch(
                addExpense(values)
            ).unwrap()

            /*
                Refresh dashboard because
                spending values changed.
            */

            await dispatch(
                getDashboard()
            ).unwrap()

            await dispatch(
                getCategorySpending()
            ).unwrap()

            setFormOpen(false)

            showNotice(
                "Expense added successfully"
            )

        } catch (error) {

            console.error(error)

            showNotice(
                typeof error === "string"
                    ? error
                    : "Failed to add expense"
            )

        } finally {

            setLoading(false)

        }
    }


    /*
        ============================
        DELETE EXPENSE
        ============================
    */

    const handleDeleteExpense = async (expenseId) => {

        try {

            await dispatch(
                deleteExpense(expenseId)
            ).unwrap()

            await dispatch(
                getDashboard()
            ).unwrap()

            await dispatch(
                getCategorySpending()
            ).unwrap()

            showNotice(
                "Expense deleted successfully"
            )

        } catch (error) {

            console.error(error)

            showNotice(
                typeof error === "string"
                    ? error
                    : "Failed to delete expense"
            )

        }

    }


    /*
        ============================
        CATEGORY CHART
        ============================
    */

    const colors = [
        "#34d399",
        "#60a5fa",
        "#fbbf24",
        "#f472b6",
        "#a78bfa",
        "#fb7185"
    ]

    const categoryData = useMemo(() => {

        return categorySpending.map(
            (item, index) => ({
                name: item.name,
                value: Number(item.total_spending),
                color: colors[index % colors.length]
            })
        )

    }, [categorySpending])


    /*
        ============================
        TOTAL SHOWN
        ============================
    */

    const totalVisible = useMemo(() => {

        return expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        )

    }, [expenses])


    /*
        ============================
        NAVIGATION
        ============================
    */

    const nav = [
        {
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            label: "Expenses",
            icon: FileText
        },
        {
            label: "Categories",
            icon: Tags
        },
        {
            label: "Budgets",
            icon: Wallet
        }
    ]


    /*
        ============================
        RENDER
        ============================
    */

    return (

        <div className="dashboard-shell">

            {/* SIDEBAR */}

            <aside
                className={`sidebar ${
                    menuOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >

                <div className="brand">

                    <span className="brand-mark">
                        <CircleDollarSign />
                    </span>

                    <span>
                        Expense
                        <span className="brand-accent">
                            Flow
                        </span>
                    </span>

                    <button
                        className="close-menu"
                        aria-label="Close menu"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        <X />
                    </button>

                </div>


                <nav
                    className="nav-list"
                    aria-label="Primary navigation"
                >

                    {nav.map(
                        ({ label, icon: Icon }) => (

                            <button
                                key={label}
                                className={`nav-item ${
                                    active === label
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => {

                                    setActive(label)

                                    setMenuOpen(false)

                                }}
                            >

                                <Icon />

                                {label}

                                {label === "Expenses" && (

                                    <span className="nav-count">
                                        {expenses.length}
                                    </span>

                                )}

                            </button>

                        )
                    )}

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="nav-item"
                        onClick={() =>
                            showNotice(
                                "Settings are coming soon"
                            )
                        }
                    >
                        <Settings />
                        Settings
                    </button>


                    <div className="profile">

                        <div className="avatar">
                            JD
                        </div>

                        <div className="min-w-0">

                            <p className="profile-name">
                                ExpenseFlow User
                            </p>

                            <p className="profile-email">
                                Your account
                            </p>

                        </div>

                        <ChevronDown className="profile-chevron" />

                    </div>

                </div>

            </aside>


            {menuOpen && (

                <button
                    className="mobile-scrim"
                    aria-label="Close navigation"
                    onClick={() =>
                        setMenuOpen(false)
                    }
                />

            )}


            {/* MAIN */}

            <main className="main-content">


                {/* TOP BAR */}

                <header className="topbar">

                    <button
                        className="mobile-menu"
                        aria-label="Open menu"
                        onClick={() =>
                            setMenuOpen(true)
                        }
                    >
                        <Menu />
                    </button>


                    <div>

                        <p className="eyebrow">
                            ExpenseFlow
                        </p>

                        <h1>
                            {active === "Dashboard"
                                ? "Good morning"
                                : active
                            }
                        </h1>

                    </div>


                    <div className="topbar-actions">

                        <button
                            className="icon-button"
                            aria-label="Search"
                            onClick={() =>
                                showNotice(
                                    "Search is coming soon"
                                )
                            }
                        >
                            <Search />
                        </button>


                        <button
                            className="icon-button notification"
                            aria-label="Notifications"
                            onClick={() =>
                                showNotice(
                                    "You are all caught up"
                                )
                            }
                        >

                            <Bell />

                            <i />

                        </button>


                        <button className="top-avatar">
                            JD
                        </button>

                    </div>

                </header>


                <div className="content-wrap">


                    {/* ADD EXPENSE FORM */}

                    {formOpen && (

                        <AddExpenseForm
                            categories={categories}
                            loading={loading}
                            onCancel={() =>
                                setFormOpen(false)
                            }
                            onSubmit={
                                handleAddExpense
                            }
                        />

                    )}


                    {!formOpen && (

                        <section className="welcome-row">

                            <div>

                                <p className="section-kicker">
                                    Your financial overview
                                </p>

                                <p className="muted-copy">
                                    Here&apos;s what&apos;s
                                    happening with your money.
                                </p>

                            </div>


                            <button
                                className="primary-button"
                                onClick={() =>
                                    setFormOpen(true)
                                }
                            >

                                <Plus />

                                Add expense

                            </button>

                        </section>

                    )}


                    {/* METRICS */}

                    <section className="metrics-grid">

                        <MetricCard
                            label="Total spending"
                            value={`₹${Number(
                                dashboard.totalSpending || 0
                            ).toFixed(2)}`}
                            icon={Wallet}
                        />


                        <MetricCard
                            label="This month"
                            value={`₹${Number(
                                dashboard.monthly?.spending || 0
                            ).toFixed(2)}`}
                            icon={TrendingUp}
                        />


                        <MetricCard
                            label="This week"
                            value={`₹${Number(
                                dashboard.weekly?.spending || 0
                            ).toFixed(2)}`}
                            icon={CalendarDays}
                        />


                        <MetricCard
                            label="Budget left"
                            value={`₹${Number(
                                dashboard.monthly?.remaining || 0
                            ).toFixed(2)}`}
                            positive={
                                Number(
                                    dashboard.monthly?.remaining || 0
                                ) >= 0
                            }
                            icon={CreditCard}
                        />

                    </section>


                    {/* QUICK ACTIONS */}

                    <section className="quick-row">

                        <div>

                            <p className="section-title">
                                Quick actions
                            </p>

                            <p className="muted-copy">
                                Stay on top of your finances.
                            </p>

                        </div>


                        <div className="quick-actions">

                            <button
                                onClick={() =>
                                    setFormOpen(true)
                                }
                            >
                                <Plus />
                                Add expense
                            </button>


                            <button
                                onClick={() =>
                                    showNotice(
                                        "Category manager coming next"
                                    )
                                }
                            >
                                <Tags />
                                Manage categories
                            </button>


                            <button
                                onClick={() =>
                                    showNotice(
                                        "Budget manager coming next"
                                    )
                                }
                            >
                                <Wallet />
                                Set a budget
                            </button>

                        </div>

                    </section>


                    {/* CHARTS */}

                    <section className="charts-grid">


                        {/* SPENDING */}

                        <div className="panel trend-panel">

                            <div className="panel-heading">

                                <div>

                                    <p className="section-title">
                                        Spending overview
                                    </p>

                                    <p className="muted-copy">
                                        Your current spending
                                    </p>

                                </div>

                            </div>


                            <div className="chart-wrap trend-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <AreaChart
                                        data={expenses
                                            .slice()
                                            .reverse()
                                            .slice(0, 7)
                                            .map(
                                                (
                                                    expense
                                                ) => ({
                                                    day:
                                                        expense.date,
                                                    spent:
                                                        Number(
                                                            expense.amount
                                                        )
                                                })
                                            )}
                                    >

                                        <defs>

                                            <linearGradient
                                                id="trendFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >

                                                <stop
                                                    offset="0%"
                                                    stopColor="#34d399"
                                                    stopOpacity={0.28}
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#34d399"
                                                    stopOpacity={0}
                                                />

                                            </linearGradient>

                                        </defs>


                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#718096",
                                                fontSize: 10
                                            }}
                                        />

                                        <YAxis hide />


                                        <Tooltip
                                            contentStyle={{
                                                background:
                                                    "#14251f",
                                                border:
                                                    "1px solid #244b3d",
                                                borderRadius: 12,
                                                color:
                                                    "#e7f5ef"
                                            }}
                                            formatter={(value) => [
                                                `₹${value}`,
                                                "Spent"
                                            ]}
                                        />


                                        <Area
                                            type="monotone"
                                            dataKey="spent"
                                            stroke="#34d399"
                                            strokeWidth={3}
                                            fill="url(#trendFill)"
                                        />

                                    </AreaChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="panel category-panel">

                            <div className="panel-heading">

                                <div>

                                    <p className="section-title">
                                        By category
                                    </p>

                                    <p className="muted-copy">
                                        Spending breakdown
                                    </p>

                                </div>

                                <button
                                    className="more-button"
                                    onClick={() =>
                                        showNotice(
                                            "Category options coming soon"
                                        )
                                    }
                                >
                                    <MoreHorizontal />
                                </button>

                            </div>


                            <div className="category-body">

                                {categoryData.length > 0 ? (

                                    <>

                                        <div className="donut-wrap">

                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >

                                                <PieChart>

                                                    <Pie
                                                        data={categoryData}
                                                        innerRadius={57}
                                                        outerRadius={78}
                                                        paddingAngle={3}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >

                                                        {categoryData.map(
                                                            (
                                                                entry
                                                            ) => (

                                                                <Cell
                                                                    key={
                                                                        entry.name
                                                                    }
                                                                    fill={
                                                                        entry.color
                                                                    }
                                                                />

                                                            )
                                                        )}

                                                    </Pie>

                                                </PieChart>

                                            </ResponsiveContainer>


                                            <div className="donut-label">

                                                <strong>
                                                    ₹
                                                    {totalVisible.toFixed(
                                                        0
                                                    )}
                                                </strong>

                                                <span>
                                                    total
                                                </span>

                                            </div>

                                        </div>


                                        <div className="legend">

                                            {categoryData.map(
                                                (
                                                    item
                                                ) => (

                                                    <div
                                                        className="legend-item"
                                                        key={
                                                            item.name
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                backgroundColor:
                                                                    item.color
                                                            }}
                                                        />

                                                        {item.name}

                                                        <strong>
                                                            ₹
                                                            {item.value.toFixed(
                                                                2
                                                            )}
                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </>

                                ) : (

                                    <p className="muted-copy">
                                        No category spending yet.
                                    </p>

                                )}

                            </div>

                        </div>

                    </section>


                    {/* EXPENSE TABLE */}

                    <section className="panel expenses-panel">

                        <div className="panel-heading">

                            <div>

                                <p className="section-title">
                                    Recent expenses
                                </p>

                                <p className="muted-copy">
                                    {expenses.length} transactions
                                </p>

                            </div>

                        </div>


                        <div className="table-wrap">

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

                                        <th aria-label="Actions" />

                                    </tr>

                                </thead>


                                <tbody>

                                    {expenses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "30px"
                                                }}
                                            >
                                                <p className="muted-copy">
                                                    No expenses yet.
                                                </p>
                                            </td>

                                        </tr>

                                    ) : (

                                        expenses.map(
                                            (
                                                expense
                                            ) => {

                                                const category =
                                                    categories.find(
                                                        (
                                                            item
                                                        ) =>
                                                            Number(
                                                                item.id
                                                            ) ===
                                                            Number(
                                                                expense.category_id
                                                            )
                                                    )

                                                return (

                                                    <tr
                                                        key={
                                                            expense.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="merchant">

                                                                <span className="merchant-icon bg-emerald-400/15 text-emerald-300">

                                                                    ₹

                                                                </span>

                                                                <span>

                                                                    {
                                                                        expense.description
                                                                    }

                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="category-pill">

                                                                {category
                                                                    ? category.name
                                                                    : "Unknown"}

                                                            </span>

                                                        </td>


                                                        <td className="date-cell">

                                                            {
                                                                expense.date
                                                            }

                                                        </td>


                                                        <td className="amount-cell">

                                                            -₹
                                                            {Number(
                                                                expense.amount
                                                            ).toFixed(
                                                                2
                                                            )}

                                                        </td>


                                                        <td>

                                                            <button
                                                                className="delete-button"
                                                                aria-label="Delete expense"
                                                                onClick={() =>
                                                                    handleDeleteExpense(
                                                                        expense.id
                                                                    )
                                                                }
                                                            >

                                                                <Trash2 />

                                                            </button>

                                                        </td>

                                                    </tr>

                                                )

                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        <div className="table-footer">

                            <span>
                                Total shown: ₹
                                {totalVisible.toFixed(2)}
                            </span>

                            <span>
                                {expenses.length} expenses
                            </span>

                        </div>

                    </section>

                </div>

            </main>


            {/* TOAST */}

            {notice && (

                <div
                    className="toast-notice"
                    role="status"
                >
                    {notice}
                </div>

            )}

        </div>
    )
}

export default Home