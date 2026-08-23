import { useState } from "react"
import {
    CalendarDays,
    Check,
    CircleDollarSign,
    Loader2,
    X
} from "lucide-react"

const today = () => {
    return new Date().toISOString().slice(0, 10)
}

function AddExpenseForm({
    categories = [],
    onSubmit,
    onCancel,
    loading = false
}) {

    const [values, setValues] = useState({
        amount: "",
        description: "",
        date: today(),
        categoryId: ""
    })

    const [errors, setErrors] = useState({})

    const update = (field, value) => {

        setValues((current) => ({
            ...current,
            [field]: value
        }))

        if (errors[field]) {
            setErrors((current) => ({
                ...current,
                [field]: ""
            }))
        }
    }

    const validate = () => {

        const nextErrors = {}

        if (!values.amount || Number(values.amount) <= 0) {
            nextErrors.amount = "Enter an amount greater than zero."
        }

        if (!values.description.trim()) {
            nextErrors.description = "Add a short description."
        }

        if (!values.date) {
            nextErrors.date = "Choose a date."
        }

        if (!values.categoryId) {
            nextErrors.categoryId = "Select a category."
        }

        setErrors(nextErrors)

        return Object.keys(nextErrors).length === 0
    }

    const submit = (event) => {

        event.preventDefault()

        if (loading) return

        if (!validate()) return

        onSubmit({
            amount: values.amount,
            description: values.description,
            date: values.date,
            categoryId: values.categoryId
        })
    }

    return (
        <section
            style={{
                width: "100%",
                background: "#071712",
                border: "1px solid #16362c",
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
                boxShadow: "0 12px 35px rgba(0,0,0,0.25)"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "20px",
                    marginBottom: "10px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >

                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "#0d3328",
                            border: "1px solid #1c5543",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <CircleDollarSign
                            size={22}
                            color="#39dca7"
                        />
                    </div>

                    <div>

                        <p
                            style={{
                                margin: 0,
                                color: "#68a895",
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase"
                            }}
                        >
                            New transaction
                        </p>

                        <h2
                            style={{
                                margin: "4px 0 0",
                                color: "#f1fff9",
                                fontSize: "24px",
                                fontWeight: 600
                            }}
                        >
                            Add expense
                        </h2>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    aria-label="Close add expense form"
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        border: "1px solid #1c3c32",
                        background: "#0a211b",
                        color: "#8aafa4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: loading ? "not-allowed" : "pointer",
                        flexShrink: 0
                    }}
                >
                    <X size={19} />
                </button>

            </div>

            <p
                style={{
                    margin: "0 0 26px",
                    color: "#789b91",
                    fontSize: "14px",
                    lineHeight: 1.6
                }}
            >
                Capture the details now and keep your spending history accurate.
            </p>

            {/* FORM */}

            <form
                onSubmit={submit}
                noValidate
            >

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: "20px"
                    }}
                >

                    {/* AMOUNT */}

                    <div>

                        <label
                            htmlFor="expense-amount"
                            style={labelStyle}
                        >
                            Amount <span style={requiredStyle}>*</span>
                        </label>

                        <div style={inputWrapperStyle}>

                            <span
                                style={{
                                    color: "#39dca7",
                                    fontSize: "16px",
                                    fontWeight: 600
                                }}
                            >
                                ₹
                            </span>

                            <input
                                id="expense-amount"
                                value={values.amount}
                                onChange={(event) =>
                                    update("amount", event.target.value)
                                }
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                placeholder="0.00"
                                disabled={loading}
                                style={inputStyle}
                            />

                        </div>

                        {errors.amount && (
                            <ErrorMessage message={errors.amount} />
                        )}

                    </div>

                    {/* DESCRIPTION */}

                    <div>

                        <label
                            htmlFor="expense-description"
                            style={labelStyle}
                        >
                            Description <span style={requiredStyle}>*</span>
                        </label>

                        <input
                            id="expense-description"
                            value={values.description}
                            onChange={(event) =>
                                update("description", event.target.value)
                            }
                            type="text"
                            maxLength={120}
                            placeholder="Lunch at college"
                            disabled={loading}
                            style={fullInputStyle}
                        />

                        {errors.description && (
                            <ErrorMessage message={errors.description} />
                        )}

                    </div>

                    {/* DATE */}

                    <div>

                        <label
                            htmlFor="expense-date"
                            style={labelStyle}
                        >
                            Date <span style={requiredStyle}>*</span>
                        </label>

                        <div style={dateWrapperStyle}>

                            <input
                                id="expense-date"
                                value={values.date}
                                onChange={(event) =>
                                    update("date", event.target.value)
                                }
                                type="date"
                                disabled={loading}
                                style={{
                                    ...inputStyle,
                                    colorScheme: "dark"
                                }}
                            />

                            <CalendarDays
                                size={18}
                                color="#6d9d8f"
                                style={{
                                    pointerEvents: "none"
                                }}
                            />

                        </div>

                        {errors.date && (
                            <ErrorMessage message={errors.date} />
                        )}

                    </div>

                    {/* CATEGORY */}

                    <div>

                        <label
                            htmlFor="expense-category"
                            style={labelStyle}
                        >
                            Category <span style={requiredStyle}>*</span>
                        </label>

                        <select
                            id="expense-category"
                            value={values.categoryId}
                            onChange={(event) =>
                                update("categoryId", event.target.value)
                            }
                            disabled={loading}
                            style={fullInputStyle}
                        >

                            <option value="">
                                Select category
                            </option>

                            {categories.map((category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>

                        {errors.categoryId && (
                            <ErrorMessage message={errors.categoryId} />
                        )}

                    </div>

                </div>

                {/* FOOTER BUTTONS */}

                <div
                    style={{
                        marginTop: "30px",
                        paddingTop: "22px",
                        borderTop: "1px solid #153329",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        style={secondaryButtonStyle}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        style={primaryButtonStyle}
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="expense-spin"
                                />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Check size={17} />
                                Add expense
                            </>
                        )}

                    </button>

                </div>

            </form>

        </section>
    )
}


/* ------------------------------------------------ */
/* REUSABLE STYLES */
/* ------------------------------------------------ */

const labelStyle = {
    display: "block",
    marginBottom: "9px",
    color: "#c9ded8",
    fontSize: "13px",
    fontWeight: 600
}

const requiredStyle = {
    color: "#39dca7"
}

const inputWrapperStyle = {
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
    boxSizing: "border-box",
    background: "#091f19",
    border: "1px solid #1b3d32",
    borderRadius: "10px"
}

const dateWrapperStyle = {
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 14px",
    boxSizing: "border-box",
    background: "#091f19",
    border: "1px solid #1b3d32",
    borderRadius: "10px"
}

const inputStyle = {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#f1fff9",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box"
}

const fullInputStyle = {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    boxSizing: "border-box",
    background: "#091f19",
    border: "1px solid #1b3d32",
    borderRadius: "10px",
    outline: "none",
    color: "#f1fff9",
    fontSize: "14px",
    fontFamily: "inherit"
}

const secondaryButtonStyle = {
    height: "42px",
    padding: "0 20px",
    borderRadius: "9px",
    border: "1px solid #25473c",
    background: "#0a211b",
    color: "#aac4bc",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer"
}

const primaryButtonStyle = {
    height: "42px",
    padding: "0 20px",
    borderRadius: "9px",
    border: "none",
    background: "#35d9a4",
    color: "#04130e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer"
}


/* ------------------------------------------------ */
/* ERROR COMPONENT */
/* ------------------------------------------------ */

function ErrorMessage({ message }) {

    return (
        <p
            style={{
                margin: "6px 0 0",
                color: "#ff7f8a",
                fontSize: "12px"
            }}
            role="alert"
        >
            {message}
        </p>
    )
}

export default AddExpenseForm