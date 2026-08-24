import {
    ArrowLeft,
    Bell,
    CalendarDays,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    Edit3,
    FileText,
    KeyRound,
    LogOut,
    Mail,
    Moon,
    Shield,
    Trash2,
    User,
    Wallet,
    X
} from "lucide-react"


import {
    useEffect,
    useState
} from "react"


import {
    useDispatch,
    useSelector
} from "react-redux"


import {
    useNavigate
} from "react-router-dom"


import {
    getCurrentUser,
    logout,
    updateCurrentUser
} from "../redux/slices/authSlice"


function Profile() {

    const navigate = useNavigate()

    const dispatch = useDispatch()


    /*
    ========================================
    REDUX
    ========================================
    */

    const dashboard = useSelector(
        (state) => state.dashboard
    )

    const expenses = useSelector(
        (state) => state.expense.expenses
    )

    const user = useSelector(
        (state) => state.auth.user
    )

    const userLoading = useSelector(
        (state) => state.auth.loading
    )

    const updateLoading = useSelector(
        (state) => state.auth.updateLoading
    )

    const updateError = useSelector(
        (state) => state.auth.updateError
    )


    /*
    ========================================
    EDIT PROFILE STATE
    ========================================
    */

    const [
        isEditOpen,
        setIsEditOpen
    ] = useState(false)


    const [
        username,
        setUsername
    ] = useState("")


    const [
        email,
        setEmail
    ] = useState("")


    /*
    ========================================
    GET CURRENT USER
    ========================================
    */

    useEffect(() => {

        if (!user) {

            dispatch(
                getCurrentUser()
            )

        }

    }, [dispatch, user])


    /*
    ========================================
    OPEN EDIT PROFILE
    ========================================
    */

    const handleOpenEdit = () => {

        setUsername(
            user?.username || ""
        )

        setEmail(
            user?.email || ""
        )

        setIsEditOpen(true)

    }


    /*
    ========================================
    CLOSE EDIT PROFILE
    ========================================
    */

    const handleCloseEdit = () => {

        if (updateLoading) {
            return
        }

        setIsEditOpen(false)

        setUsername(
            user?.username || ""
        )

        setEmail(
            user?.email || ""
        )

    }


    /*
    ========================================
    SAVE PROFILE
    ========================================
    */

    const handleSaveProfile = async (event) => {

        event.preventDefault()


        if (!username.trim()) {

            return

        }


        if (!email.trim()) {

            return

        }


        const result = await dispatch(
            updateCurrentUser({
                username: username.trim(),
                email: email.trim()
            })
        )


        if (
            updateCurrentUser.fulfilled.match(
                result
            )
        ) {

            setIsEditOpen(false)

        }

    }


    /*
    ========================================
    MEMBER SINCE
    ========================================
    */

    const joinedDate = user?.created_at
        ? new Date(
            user.created_at
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        )
        : ""


    /*
    ========================================
    USER INITIALS
    ========================================
    */

    const initials = user?.username
        ? user.username
            .split(" ")
            .map(
                (name) => name[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U"


    /*
    ========================================
    LOGOUT
    ========================================
    */

    const handleLogout = () => {

        dispatch(
            logout()
        )

        navigate("/login")

    }


    /*
    ========================================
    LOADING
    ========================================
    */

    if (userLoading && !user) {

        return (

            <div className="dashboard-shell">

                <main className="main-content">

                    <div className="content-wrap">

                        <p className="muted-copy">
                            Loading profile...
                        </p>

                    </div>

                </main>

            </div>

        )

    }


    /*
    ========================================
    RENDER
    ========================================
    */

    return (

        <div className="dashboard-shell">


            {/* ========================================
                SIDEBAR
            ======================================== */}

            <aside className="sidebar">


                {/* BRAND */}

                <div
                    className="brand"
                    onClick={() =>
                        navigate("/home")
                    }
                    style={{
                        cursor: "pointer"
                    }}
                >

                    <span className="brand-mark">

                        <CircleDollarSign />

                    </span>

                    <span>

                        Expense

                        <span className="brand-accent">
                            Flow
                        </span>

                    </span>

                </div>


                {/* NAVIGATION */}

                <nav
                    className="nav-list"
                    aria-label="Primary navigation"
                >

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/home")
                        }
                    >

                        <CircleDollarSign />

                        Dashboard

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/expenses")
                        }
                    >

                        <FileText />

                        Expenses

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/categories")
                        }
                    >

                        <Wallet />

                        Categories

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/budget")
                        }
                    >

                        <CreditCard />

                        Budgets

                    </button>


                    <button
                        className="nav-item active"
                    >

                        <User />

                        Profile

                    </button>

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">


                    <button
                        className="nav-item"
                        onClick={() =>
                            alert(
                                "Settings coming soon"
                            )
                        }
                    >

                        <Moon />

                        Settings

                    </button>


                    <div className="profile">

                        <div className="avatar">

                            {initials}

                        </div>


                        <div className="min-w-0">

                            <p className="profile-name">

                                {user?.username || "User"}

                            </p>


                            <p className="profile-email">

                                {user?.email || ""}

                            </p>

                        </div>

                    </div>

                </div>

            </aside>


            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main className="main-content">


                {/* TOP BAR */}

                <header className="topbar">

                    <div>

                        <p className="eyebrow">
                            ExpenseFlow
                        </p>

                        <h1>
                            Profile
                        </h1>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="content-wrap">


                    {/* BACK BUTTON */}

                    <button
                        className="more-button"
                        onClick={() =>
                            navigate("/home")
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px"
                        }}
                    >

                        <ArrowLeft />

                        Back to dashboard

                    </button>


                    {/* ========================================
                        PROFILE HERO
                    ======================================== */}

                    <section className="profile-hero panel">


                        <div className="profile-hero-left">


                            <div className="profile-large-avatar">

                                {initials}

                            </div>


                            <div>

                                <p className="section-kicker">
                                    Personal account
                                </p>


                                <h2 className="profile-heading">

                                    {user?.username || "User"}

                                </h2>


                                <p className="muted-copy">

                                    {user?.email || ""}

                                </p>


                                <div className="profile-status">

                                    <span className="status-dot" />

                                    Active account

                                </div>

                            </div>

                        </div>


                        <button
                            className="primary-button"
                            onClick={
                                handleOpenEdit
                            }
                        >

                            <Edit3 />

                            Edit profile

                        </button>

                    </section>


                    {/* ========================================
                        PROFILE GRID
                    ======================================== */}

                    <section className="profile-grid">


                        {/* PERSONAL INFORMATION */}

                        <div className="panel profile-card">


                            <div className="panel-heading">

                                <div>

                                    <p className="section-title">
                                        Personal information
                                    </p>

                                    <p className="muted-copy">
                                        Your account details
                                    </p>

                                </div>

                                <User />

                            </div>


                            <div className="profile-info-list">


                                {/* USERNAME */}

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <User />

                                    </div>


                                    <div>

                                        <span>
                                            Full name
                                        </span>

                                        <strong>

                                            {user?.username ||
                                                "Not available"}

                                        </strong>

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <Mail />

                                    </div>


                                    <div>

                                        <span>
                                            Email address
                                        </span>

                                        <strong>

                                            {user?.email ||
                                                "Not available"}

                                        </strong>

                                    </div>

                                </div>


                                {/* USERNAME */}

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <User />

                                    </div>


                                    <div>

                                        <span>
                                            Username
                                        </span>

                                        <strong>

                                            {user?.username
                                                ? `@${user.username}`
                                                : "Not available"}

                                        </strong>

                                    </div>

                                </div>


                                {/* MEMBER SINCE */}

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <CalendarDays />

                                    </div>


                                    <div>

                                        <span>
                                            Member since
                                        </span>

                                        <strong>

                                            {joinedDate ||
                                                "Not available"}

                                        </strong>

                                    </div>

                                </div>


                            </div>

                        </div>


                        {/* EXPENSE OVERVIEW */}

                        <div className="panel profile-card">


                            <div className="panel-heading">

                                <div>

                                    <p className="section-title">
                                        Expense overview
                                    </p>

                                    <p className="muted-copy">
                                        Your financial activity
                                    </p>

                                </div>

                                <TrendingUpIcon />

                            </div>


                            <div className="profile-stat-grid">


                                <div className="profile-stat">

                                    <span>
                                        Total spending
                                    </span>

                                    <strong>

                                        ₹
                                        {Number(
                                            dashboard.totalSpending || 0
                                        ).toFixed(2)}

                                    </strong>

                                </div>


                                <div className="profile-stat">

                                    <span>
                                        Transactions
                                    </span>

                                    <strong>

                                        {expenses.length}

                                    </strong>

                                </div>


                                <div className="profile-stat">

                                    <span>
                                        This month
                                    </span>

                                    <strong>

                                        ₹
                                        {Number(
                                            dashboard.monthly?.spending || 0
                                        ).toFixed(2)}

                                    </strong>

                                </div>


                                <div className="profile-stat">

                                    <span>
                                        Budget remaining
                                    </span>

                                    <strong
                                        className={
                                            Number(
                                                dashboard.monthly?.remaining || 0
                                            ) >= 0
                                                ? "stat-positive"
                                                : "stat-negative"
                                        }
                                    >

                                        ₹
                                        {Number(
                                            dashboard.monthly?.remaining || 0
                                        ).toFixed(2)}

                                    </strong>

                                </div>


                            </div>

                        </div>

                    </section>


                    {/* ========================================
                        ACCOUNT SETTINGS
                    ======================================== */}

                    <section className="panel profile-settings">


                        <div className="panel-heading">

                            <div>

                                <p className="section-title">
                                    Account settings
                                </p>

                                <p className="muted-copy">
                                    Manage your ExpenseFlow account
                                </p>

                            </div>

                            <Shield />

                        </div>


                        <div className="settings-list">


                            {/* EDIT PROFILE */}

                            <button
                                className="settings-row"
                                onClick={
                                    handleOpenEdit
                                }
                            >

                                <div className="settings-left">

                                    <span className="settings-icon">

                                        <Edit3 />

                                    </span>


                                    <div>

                                        <strong>
                                            Edit profile
                                        </strong>

                                        <span>
                                            Update your name and
                                            account information
                                        </span>

                                    </div>

                                </div>


                                <ChevronRight />

                            </button>


                            {/* CHANGE PASSWORD */}

                            <button
                                className="settings-row"
                                onClick={() =>
                                    alert(
                                        "Change password coming soon"
                                    )
                                }
                            >

                                <div className="settings-left">

                                    <span className="settings-icon">

                                        <KeyRound />

                                    </span>


                                    <div>

                                        <strong>
                                            Change password
                                        </strong>

                                        <span>
                                            Update your account password
                                        </span>

                                    </div>

                                </div>


                                <ChevronRight />

                            </button>


                            {/* NOTIFICATIONS */}

                            <button
                                className="settings-row"
                                onClick={() =>
                                    alert(
                                        "Notification settings coming soon"
                                    )
                                }
                            >

                                <div className="settings-left">

                                    <span className="settings-icon">

                                        <Bell />

                                    </span>


                                    <div>

                                        <strong>
                                            Notifications
                                        </strong>

                                        <span>
                                            Manage expense reminders
                                            and alerts
                                        </span>

                                    </div>

                                </div>


                                <ChevronRight />

                            </button>


                        </div>

                    </section>


                    {/* ========================================
                        ACCOUNT ACTIONS
                    ======================================== */}

                    <section className="panel danger-panel">


                        <div>

                            <p className="section-title">
                                Account actions
                            </p>

                            <p className="muted-copy">
                                Manage your account access
                            </p>

                        </div>


                        <div className="danger-actions">


                            <button
                                className="logout-button"
                                onClick={
                                    handleLogout
                                }
                            >

                                <LogOut />

                                Logout

                            </button>


                            <button
                                className="delete-account-button"
                                onClick={() =>
                                    alert(
                                        "Delete account coming soon"
                                    )
                                }
                            >

                                <Trash2 />

                                Delete account

                            </button>


                        </div>

                    </section>


                </div>

            </main>


            {/* ========================================
                EDIT PROFILE MODAL
            ======================================== */}

            {isEditOpen && (

                <div
                    className="profile-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            handleCloseEdit()

                        }

                    }}
                >

                    <div className="profile-modal">


                        {/* MODAL HEADER */}

                        <div className="profile-modal-header">

                            <div>

                                <p className="section-kicker">
                                    Account
                                </p>

                                <h2>
                                    Edit profile
                                </h2>

                                <p className="muted-copy">
                                    Update your account information
                                </p>

                            </div>


                            <button
                                type="button"
                                className="profile-modal-close"
                                onClick={
                                    handleCloseEdit
                                }
                                disabled={
                                    updateLoading
                                }
                            >

                                <X />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSaveProfile
                            }
                        >


                            {/* USERNAME */}

                            <div className="profile-form-group">

                                <label htmlFor="profile-username">
                                    Username
                                </label>


                                <div className="profile-input-wrapper">

                                    <User />

                                    <input
                                        id="profile-username"
                                        type="text"
                                        value={username}
                                        onChange={(event) =>
                                            setUsername(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter username"
                                        disabled={
                                            updateLoading
                                        }
                                        autoComplete="username"
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="profile-form-group">

                                <label htmlFor="profile-email">
                                    Email address
                                </label>


                                <div className="profile-input-wrapper">

                                    <Mail />

                                    <input
                                        id="profile-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter email"
                                        disabled={
                                            updateLoading
                                        }
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            {/* ERROR */}

                            {updateError && (

                                <div className="profile-form-error">

                                    {typeof updateError === "string"
                                        ? updateError
                                        : "Failed to update profile"}

                                </div>

                            )}


                            {/* BUTTONS */}

                            <div className="profile-modal-actions">


                                <button
                                    type="button"
                                    className="more-button"
                                    onClick={
                                        handleCloseEdit
                                    }
                                    disabled={
                                        updateLoading
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        updateLoading ||
                                        !username.trim() ||
                                        !email.trim()
                                    }
                                >

                                    {updateLoading
                                        ? "Saving..."
                                        : "Save changes"}

                                </button>


                            </div>


                        </form>

                    </div>

                </div>

            )}

        </div>

    )

}


/*
========================================
TRENDING UP ICON
========================================
*/

function TrendingUpIcon() {

    return (

        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >

            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />

            <polyline points="16 7 22 7 22 13" />

        </svg>

    )

}


export default Profile