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
    changePassword,
    clearPasswordState,
    deleteAccount,
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

    const passwordLoading = useSelector(
        (state) => state.auth.passwordLoading
    )

    const passwordError = useSelector(
        (state) => state.auth.passwordError
    )

    const passwordSuccess = useSelector(
        (state) => state.auth.passwordSuccess
    )

    const deleteLoading = useSelector(
        (state) => state.auth.deleteLoading
    )

    const deleteError = useSelector(
        (state) => state.auth.deleteError
    )


    /*
    ========================================
    MODAL STATE
    ========================================
    */

    const [
        isEditOpen,
        setIsEditOpen
    ] = useState(false)


    const [
        isPasswordOpen,
        setIsPasswordOpen
    ] = useState(false)


    /*
    ========================================
    EDIT PROFILE STATE
    ========================================
    */

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
    PASSWORD STATE
    ========================================
    */

    const [
        currentPassword,
        setCurrentPassword
    ] = useState("")


    const [
        newPassword,
        setNewPassword
    ] = useState("")


    const [
        confirmPassword,
        setConfirmPassword
    ] = useState("")


    const [
        passwordFormError,
        setPasswordFormError
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
    OPEN PASSWORD MODAL
    ========================================
    */

    const handleOpenPassword = () => {

        setCurrentPassword("")

        setNewPassword("")

        setConfirmPassword("")

        setPasswordFormError("")

        dispatch(
            clearPasswordState()
        )

        setIsPasswordOpen(true)

    }


    /*
    ========================================
    CLOSE PASSWORD MODAL
    ========================================
    */

    const handleClosePassword = () => {

        if (passwordLoading) {
            return
        }

        setIsPasswordOpen(false)

        setCurrentPassword("")

        setNewPassword("")

        setConfirmPassword("")

        setPasswordFormError("")

        dispatch(
            clearPasswordState()
        )

    }


    /*
    ========================================
    SAVE PASSWORD
    ========================================
    */

    const handleChangePassword = async (event) => {

        event.preventDefault()

        setPasswordFormError("")


        if (!currentPassword) {

            setPasswordFormError(
                "Enter your current password"
            )

            return

        }


        if (!newPassword) {

            setPasswordFormError(
                "Enter your new password"
            )

            return

        }


        if (newPassword.length < 6) {

            setPasswordFormError(
                "New password must be at least 6 characters"
            )

            return

        }


        if (newPassword !== confirmPassword) {

            setPasswordFormError(
                "Passwords do not match"
            )

            return

        }


        if (currentPassword === newPassword) {

            setPasswordFormError(
                "New password must be different from current password"
            )

            return

        }


        const result = await dispatch(
            changePassword({
                currentPassword,
                newPassword
            })
        )


        if (
            changePassword.fulfilled.match(
                result
            )
        ) {

            setCurrentPassword("")

            setNewPassword("")

            setConfirmPassword("")

        }

    }


    /*
    ========================================
    DELETE ACCOUNT
    ========================================
    */

    const handleDeleteAccount = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This will permanently delete your account and all your ExpenseFlow data. This action cannot be undone."
        )


        if (!confirmed) {
            return
        }


        const secondConfirmation =
            window.confirm(
                "Final confirmation: permanently delete your account?"
            )


        if (!secondConfirmation) {
            return
        }


        const result = await dispatch(
            deleteAccount()
        )


        if (
            deleteAccount.fulfilled.match(
                result
            )
        ) {

            navigate("/login", {
                replace: true
            })

        }

    }


    /*
    ========================================
    LOGOUT
    ========================================
    */

    const handleLogout = () => {

        dispatch(
            logout()
        )

        navigate(
            "/login",
            {
                replace: true
            }
        )

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
    INITIALS
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
                MAIN
            ======================================== */}

            <main className="main-content">


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


                <div className="content-wrap">


                    {/* BACK */}

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
                        HERO
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


                        {/* PERSONAL */}

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


                        {/* EXPENSE */}

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
                        SETTINGS
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


                            <button
                                className="settings-row"
                                onClick={
                                    handleOpenPassword
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
                                onClick={
                                    handleDeleteAccount
                                }
                                disabled={
                                    deleteLoading
                                }
                            >

                                <Trash2 />

                                {deleteLoading
                                    ? "Deleting..."
                                    : "Delete account"}

                            </button>


                        </div>


                        {deleteError && (

                            <p className="profile-form-error">

                                {deleteError}

                            </p>

                        )}

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


                        <form
                            onSubmit={
                                handleSaveProfile
                            }
                        >


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


                            {updateError && (

                                <div className="profile-form-error">
                                    {updateError}
                                </div>

                            )}


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


            {/* ========================================
                CHANGE PASSWORD MODAL
            ======================================== */}

            {isPasswordOpen && (

                <div
                    className="profile-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            handleClosePassword()

                        }

                    }}
                >

                    <div className="profile-modal">


                        <div className="profile-modal-header">

                            <div>

                                <p className="section-kicker">
                                    Security
                                </p>

                                <h2>
                                    Change password
                                </h2>

                                <p className="muted-copy">
                                    Choose a new password for your account
                                </p>

                            </div>


                            <button
                                type="button"
                                className="profile-modal-close"
                                onClick={
                                    handleClosePassword
                                }
                                disabled={
                                    passwordLoading
                                }
                            >

                                <X />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleChangePassword
                            }
                        >


                            {/* CURRENT PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="current-password">
                                    Current password
                                </label>


                                <div className="profile-input-wrapper">

                                    <KeyRound />

                                    <input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) =>
                                            setCurrentPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter current password"
                                        disabled={
                                            passwordLoading
                                        }
                                        autoComplete="current-password"
                                    />

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="new-password">
                                    New password
                                </label>


                                <div className="profile-input-wrapper">

                                    <KeyRound />

                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Minimum 6 characters"
                                        disabled={
                                            passwordLoading
                                        }
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="confirm-password">
                                    Confirm new password
                                </label>


                                <div className="profile-input-wrapper">

                                    <KeyRound />

                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        disabled={
                                            passwordLoading
                                        }
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>


                            {/* ERROR */}

                            {(passwordFormError ||
                                passwordError) && (

                                <div className="profile-form-error">

                                    {passwordFormError ||
                                        passwordError}

                                </div>

                            )}


                            {/* SUCCESS */}

                            {passwordSuccess && (

                                <div className="profile-form-success">

                                    Password changed successfully.

                                </div>

                            )}


                            <div className="profile-modal-actions">


                                <button
                                    type="button"
                                    className="more-button"
                                    onClick={
                                        handleClosePassword
                                    }
                                    disabled={
                                        passwordLoading
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        passwordLoading
                                    }
                                >

                                    {passwordLoading
                                        ? "Changing..."
                                        : "Change password"}

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
==================================================
TRENDING ICON
==================================================
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