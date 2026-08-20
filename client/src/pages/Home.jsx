import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

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

import {
    getDashboard
} from "../redux/slices/dashboardSlice"

import {
    getExpenses,
    deleteExpense
} from "../redux/slices/expenseSlice"

import {
    getCategories,
    getCategorySpending
} from "../redux/slices/categorySlice"

import {
    getBudget
} from "../redux/slices/budgetSlice"


function Home() {

    const dispatch = useDispatch()

    const [menuOpen, setMenuOpen] = useState(false)

    const [active, setActive] = useState("Dashboard")

    const [notice, setNotice] = useState("")


    // -----------------------------
    // REDUX DATA
    // -----------------------------

    const dashboard = useSelector(
        state => state.dashboard
    )

    const expenses = useSelector(
        state => state.expense.expenses
    )

    const categorySpending = useSelector(
        state => state.category.categorySpending
    )


    // -----------------------------
    // LOAD DATA
    // -----------------------------

    useEffect(() => {

        dispatch(getDashboard())

        dispatch(getExpenses())

        dispatch(getCategories())

        dispatch(getCategorySpending())

        dispatch(getBudget())

    }, [dispatch])


    // -----------------------------
    // NOTICE
    // -----------------------------

    const showNotice = (message) => {

        setNotice(message)

        setTimeout(() => {
            setNotice("")
        }, 2400)

    }


    // -----------------------------
    // TOTAL VISIBLE EXPENSES
    // -----------------------------

    const totalVisible = useMemo(() => {

        return expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        )

    }, [expenses])


    // -----------------------------
    // CATEGORY CHART DATA
    // -----------------------------

    const categoryData = categorySpending.map(
        (category, index) => {

            const colors = [
                "#34d399",
                "#60a5fa",
                "#fbbf24",
                "#f87171",
                "#a78bfa",
                "#22d3ee"
            ]

            return {
                name: category.name,
                value: Number(category.total_spending),
                color: colors[index % colors.length]
            }

        }
    )


    // -----------------------------
    // LAST 7 EXPENSES
    // -----------------------------

    const recentExpenses = [...expenses]
        .sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date)
        )
        .slice(0, 5)


    // -----------------------------
    // DELETE EXPENSE
    // -----------------------------

    const handleDeleteExpense = (expenseId) => {

        dispatch(deleteExpense(expenseId))

        showNotice("Expense deleted")

    }


    // -----------------------------
    // NAVIGATION
    // -----------------------------

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


    return (

        <div className="dashboard-shell">


            {/* ================= SIDEBAR ================= */}

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
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        <X />
                    </button>

                </div>


                <nav className="nav-list">

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
                    onClick={() =>
                        setMenuOpen(false)
                    }
                />

            )}


            {/* ================= MAIN ================= */}

            <main className="main-content">


                {/* ================= TOP BAR ================= */}

                <header className="topbar">

                    <button
                        className="mobile-menu"
                        onClick={() =>
                            setMenuOpen(true)
                        }
                    >
                        <Menu />
                    </button>


                    <div>

                        <p className="eyebrow">
                            Your ExpenseFlow dashboard
                        </p>

                        <h1>
                            {active === "Dashboard"
                                ? "Good to see you"
                                : active}
                        </h1>

                    </div>


                    <div className="topbar-actions">

                        <button
                            className="icon-button"
                            onClick={() =>
                                showNotice(
                                    "Search coming soon"
                                )
                            }
                        >
                            <Search />
                        </button>


                        <button
                            className="icon-button notification"
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
                            EF
                        </button>

                    </div>

                </header>


                {/* ================= CONTENT ================= */}

                <div className="content-wrap">


                    {/* ================= WELCOME ================= */}

                    <section className="welcome-row">

                        <div>

                            <p className="section-kicker">
                                Your financial overview
                            </p>

                            <p className="muted-copy">
                                Here's what's happening
                                with your money.
                            </p>

                        </div>


                        <button
                            className="primary-button"
                            onClick={() =>
                                showNotice(
                                    "Add expense form coming next"
                                )
                            }
                        >

                            <Plus />

                            Add expense

                        </button>

                    </section>


                    {/* ================= METRICS ================= */}

                    <section className="metrics-grid">


                        <MetricCard
                            label="Total spending"
                            value={`₹${Number(
                                dashboard.totalSpending || 0
                            ).toFixed(2)}`}
                            icon={Wallet}
                            positive
                            change="overall"
                        />


                        <MetricCard
                            label="Monthly spending"
                            value={`₹${Number(
                                dashboard.monthly?.spending || 0
                            ).toFixed(2)}`}
                            icon={TrendingUp}
                            positive
                            change="this month"
                        />


                        <MetricCard
                            label="Weekly spending"
                            value={`₹${Number(
                                dashboard.weekly?.spending || 0
                            ).toFixed(2)}`}
                            icon={CalendarDays}
                            positive
                            change="this week"
                        />


                        <MetricCard
                            label="Monthly remaining"
                            value={`₹${Number(
                                dashboard.monthly?.remaining || 0
                            ).toFixed(2)}`}
                            icon={CreditCard}
                            positive
                            change="remaining"
                        />

                    </section>


                    {/* ================= QUICK ACTIONS ================= */}

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
                                    showNotice(
                                        "Add expense form coming next"
                                    )
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


                    {/* ================= CHARTS ================= */}

                    <section className="charts-grid">


                        {/* SPENDING CHART */}

                        <div className="panel trend-panel">

                            <div className="panel-heading">

                                <div>

                                    <p className="section-title">
                                        Spending overview
                                    </p>

                                    <p className="muted-copy">
                                        Your recent spending
                                    </p>

                                </div>


                                <button
                                    className="select-button"
                                    onClick={() =>
                                        showNotice(
                                            "Date filtering coming next"
                                        )
                                    }
                                >
                                    Recent
                                    <ChevronDown />
                                </button>

                            </div>


                            <div className="chart-wrap trend-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <AreaChart
                                        data={recentExpenses.map(
                                            expense => ({
                                                day:
                                                    new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday:
                                                                "short"
                                                        }
                                                    ),

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
                                                fontSize: 12
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


                        {/* CATEGORY CHART */}

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


                                <div className="donut-wrap">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    categoryData
                                                }
                                                innerRadius={57}
                                                outerRadius={78}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >

                                                {categoryData.map(
                                                    item => (

                                                        <Cell
                                                            key={
                                                                item.name
                                                            }
                                                            fill={
                                                                item.color
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
                                            {Number(
                                                totalVisible
                                            ).toFixed(0)}
                                        </strong>

                                        <span>
                                            spending
                                        </span>

                                    </div>

                                </div>


                                <div className="legend">

                                    {categoryData.map(
                                        item => (

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
                                                        0
                                                    )}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================= EXPENSES ================= */}

                    <section className="panel expenses-panel">

                        <div className="panel-heading">

                            <div>

                                <p className="section-title">
                                    Recent expenses
                                </p>

                                <p className="muted-copy">
                                    {expenses.length}
                                    transactions
                                </p>

                            </div>


                            <button
                                className="text-button"
                                onClick={() =>
                                    setActive("Expenses")
                                }
                            >

                                View all

                                <ArrowUpRight />

                            </button>

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

                                        <th />

                                    </tr>

                                </thead>


                                <tbody>

                                    {recentExpenses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty-state"
                                            >
                                                No expenses yet.
                                            </td>

                                        </tr>

                                    ) : (

                                        recentExpenses.map(
                                            expense => (

                                                <tr
                                                    key={
                                                        expense.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="merchant">

                                                            <span className="merchant-icon">
                                                                <FileText />
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

                                                            Category
                                                            #
                                                            {
                                                                expense.category_id
                                                            }

                                                        </span>

                                                    </td>


                                                    <td className="date-cell">

                                                        {new Date(
                                                            expense.date
                                                        ).toLocaleDateString()}

                                                    </td>


                                                    <td className="amount-cell">

                                                        ₹
                                                        {Number(
                                                            expense.amount
                                                        ).toFixed(
                                                            2
                                                        )}

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="delete-button"
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
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        <div className="table-footer">

                            <span>
                                Showing{" "}
                                {recentExpenses.length}{" "}
                                recent expenses
                            </span>

                        </div>

                    </section>

                </div>

            </main>


            {/* ================= TOAST ================= */}

            {notice && (

                <div className="toast-notice">

                    {notice}

                </div>

            )}

        </div>

    )
}


/* ========================================================= */
/* METRIC CARD */
/* ========================================================= */

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


                <span
                    className={
                        positive
                            ? "change positive"
                            : "change negative"
                    }
                >

                    {positive
                        ? <ArrowUpRight />
                        : <ArrowDownRight />}

                    {change}

                </span>

            </div>

        </div>

    )
}

export default Home