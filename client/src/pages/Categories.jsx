import { useEffect, useMemo, useState } from "react"

import {
    BarChart3,
    Check,
    Loader2,
    Plus,
    Tags,
    Trash2,
    X
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"

import {
    getCategories,
    addCategory,
    deleteCategory,
    getCategorySpending,
    clearCategoryError
} from "../redux/slices/categorySlice"


function DeleteCategoryModal({
    category,
    deleting,
    onCancel,
    onConfirm
}) {

    return (

        <div
            className="category-modal-backdrop"
            onMouseDown={onCancel}
        >

            <section
                className="category-modal"
                role="dialog"
                aria-modal="true"
                onMouseDown={(event) => event.stopPropagation()}
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
                    Delete category?
                </h2>

                <p>
                    Are you sure you want to delete{" "}
                    <strong>{category.name}</strong>?
                </p>

                <p>
                    This category will be removed from your categories.
                </p>

                <div className="category-modal-actions">

                    <button
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </button>

                    <button
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={deleting}
                    >

                        {deleting ? (
                            <>
                                <Loader2 className="spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}

                    </button>

                </div>

            </section>

        </div>
    )
}


function CategoryCard({
    category,
    spending,
    deleting,
    onDelete
}) {

    const amount = Number(
        spending?.total_spending || 0
    )

    return (

        <article className="category-card">

            <div className="category-card-top">

                <span className="category-card-icon">
                    <Tags />
                </span>

                <button
                    className="category-delete"
                    onClick={onDelete}
                    disabled={deleting}
                    aria-label={`Delete ${category.name}`}
                >
                    {deleting ? (
                        <Loader2 className="spin" />
                    ) : (
                        <Trash2 />
                    )}
                </button>

            </div>

            <h3>
                {category.name}
            </h3>

            <p>
                Total spending
            </p>

            <strong>
                ₹{amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </strong>

        </article>
    )
}


function CategorySpending({
    data
}) {

    const max = Math.max(
        ...data.map(
            item => Number(item.total_spending) || 0
        ),
        1
    )

    return (

        <section className="category-spending panel">

            <div className="panel-heading">

                <div>

                    <p className="section-title">
                        Spending by category
                    </p>

                    <p className="muted-copy">
                        A view of your current category totals.
                    </p>

                </div>

                <BarChart3 />

            </div>


            {data.length > 0 ? (

                <div className="spending-list">

                    {data.map((item) => {

                        const value =
                            Number(item.total_spending) || 0

                        const percentage =
                            (value / max) * 100

                        return (

                            <div
                                className="spending-row"
                                key={item.id}
                            >

                                <div>

                                    <span>
                                        {item.name}
                                    </span>

                                    <strong>
                                        ₹{value.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </strong>

                                </div>

                                <div className="spending-track">

                                    <i
                                        style={{
                                            width: `${percentage}%`
                                        }}
                                    />

                                </div>

                            </div>

                        )
                    })}

                </div>

            ) : (

                <p className="muted-copy">
                    No spending data available yet.
                </p>

            )}

        </section>
    )
}


function Categories() {

    const dispatch = useDispatch()

    const {
        categories,
        categorySpending,
        loading,
        adding,
        deletingId,
        error
    } = useSelector(
        state => state.category
    )

    const [categoryName, setCategoryName] = useState("")

    const [selectedCategory, setSelectedCategory] =
        useState(null)

    const [success, setSuccess] = useState(false)


    useEffect(() => {

        dispatch(getCategories())

        dispatch(getCategorySpending())

    }, [dispatch])


    const spendingById = useMemo(() => {

        return new Map(
            categorySpending.map(
                item => [String(item.id), item]
            )
        )

    }, [categorySpending])


    const handleAddCategory = async (event) => {

        event.preventDefault()

        const cleanName =
            categoryName.trim()

        if (!cleanName) {
            return
        }

        try {

            await dispatch(
                addCategory(cleanName)
            ).unwrap()

            setCategoryName("")

            setSuccess(true)

            setTimeout(() => {
                setSuccess(false)
            }, 2500)

            // Refresh spending data
            dispatch(getCategorySpending())

        } catch (error) {

            console.error(error)

        }
    }


    const handleDeleteCategory = async () => {

        if (!selectedCategory) {
            return
        }

        try {

            await dispatch(
                deleteCategory(
                    selectedCategory.id
                )
            ).unwrap()

            setSelectedCategory(null)

            dispatch(getCategorySpending())

        } catch (error) {

            console.error(error)

        }
    }


    const focusInput = () => {

        document
            .getElementById("category-name")
            ?.focus()

    }


    return (

        <div className="categories-page">


            {/* HEADER */}

            <div className="categories-heading">

                <div>

                    <p className="section-kicker">
                        Your financial system
                    </p>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Organize your expenses and see where your money goes.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={focusInput}
                >

                    <Plus />

                    Add category

                </button>

            </div>


            {/* ADD CATEGORY */}

            <section className="category-add-card">

                <div>

                    <p className="section-kicker">
                        Build your system
                    </p>

                    <h2>
                        Add a category
                    </h2>

                    <p>
                        Keep spending organized with categories that fit your life.
                    </p>

                </div>


                <form
                    onSubmit={handleAddCategory}
                    className="category-add-form"
                >

                    <label
                        htmlFor="category-name"
                        className="sr-only"
                    >
                        Category name
                    </label>


                    <input
                        id="category-name"
                        value={categoryName}
                        onChange={(event) => {

                            setCategoryName(
                                event.target.value
                            )

                            if (error) {
                                dispatch(
                                    clearCategoryError()
                                )
                            }

                        }}
                        placeholder="e.g. Food"
                        disabled={adding}
                    />


                    <button
                        className="primary-button"
                        type="submit"
                        disabled={
                            adding ||
                            !categoryName.trim()
                        }
                    >

                        {adding ? (

                            <>
                                <Loader2 className="spin" />

                                Adding...
                            </>

                        ) : (

                            <>
                                <Plus />

                                Add category
                            </>

                        )}

                    </button>

                </form>


                {error && (

                    <p
                        className="category-error"
                        role="alert"
                    >
                        {typeof error === "string"
                            ? error
                            : "Something went wrong."
                        }
                    </p>

                )}


                {success && (

                    <p
                        className="category-success"
                        role="status"
                    >

                        <Check />

                        Category added successfully.

                    </p>

                )}

            </section>


            {/* CATEGORY LIST */}

            {loading ? (

                <div className="category-grid">

                    {[1, 2, 3].map((item) => (

                        <div
                            className="category-skeleton"
                            key={item}
                        />

                    ))}

                </div>

            ) : categories.length > 0 ? (

                <div className="category-grid">

                    {categories.map((category) => (

                        <CategoryCard
                            key={category.id}
                            category={category}
                            spending={
                                spendingById.get(
                                    String(category.id)
                                ) ||
                                categorySpending.find(
                                    item =>
                                        item.name === category.name
                                )
                            }
                            deleting={
                                deletingId === category.id
                            }
                            onDelete={() =>
                                setSelectedCategory(category)
                            }
                        />

                    ))}

                </div>

            ) : (

                <section className="category-empty">

                    <span>
                        <Tags />
                    </span>

                    <h2>
                        No categories yet
                    </h2>

                    <p>
                        Create your first category to organize your expenses.
                    </p>

                    <button
                        className="secondary-button"
                        onClick={focusInput}
                    >

                        <Plus />

                        Add category

                    </button>

                </section>

            )}


            {/* SPENDING */}

            <CategorySpending
                data={categorySpending}
            />


            {/* DELETE MODAL */}

            {selectedCategory && (

                <DeleteCategoryModal
                    category={selectedCategory}
                    deleting={
                        deletingId === selectedCategory.id
                    }
                    onCancel={() =>
                        setSelectedCategory(null)
                    }
                    onConfirm={
                        handleDeleteCategory
                    }
                />

            )}

        </div>
    )
}

export default Categories