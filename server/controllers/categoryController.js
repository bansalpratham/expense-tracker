import pool from "../db/db.js"


// ========================================
// ADD CATEGORY
// ========================================

const addCategory = async (req, res) => {

    try {

        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }


        // Check user
        const user = await pool.query(
            "SELECT id FROM users WHERE id=$1",
            [userId]
        )

        if (user.rows.length === 0) {
            return res.status(400).json("User didn't found")
        }


        const { categoryName } = req.body

        if (!categoryName || !categoryName.trim()) {
            return res.status(400).json("Category name is required")
        }


        const cleanName = categoryName.trim()


        // Check duplicate category
        const category = await pool.query(
            `
            SELECT id
            FROM categories
            WHERE LOWER(name) = LOWER($1)
            AND user_id = $2
            `,
            [cleanName, userId]
        )


        if (category.rows.length > 0) {
            return res.status(400).json("Category already exists")
        }


        // Insert category
        const result = await pool.query(
            `
            INSERT INTO categories(name, user_id)
            VALUES($1, $2)
            RETURNING id, name, user_id
            `,
            [cleanName, userId]
        )


        return res.status(201).json(result.rows[0])

    } catch (error) {

        console.error("Add Category Error:", error)

        return res.status(500).json({
            error: "AddCategory Error"
        })
    }
}



// ========================================
// GET CATEGORIES
// ========================================

const getCategory = async (req, res) => {

    try {

        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }


        const result = await pool.query(
            `
            SELECT id, name, user_id
            FROM categories
            WHERE user_id=$1
            ORDER BY id ASC
            `,
            [userId]
        )


        return res.status(200).json(result.rows)

    } catch (error) {

        console.error("Get Category Error:", error)

        return res.status(500).json({
            error: "GetCategory Error"
        })
    }
}



// ========================================
// DELETE CATEGORY
// ========================================

const deleteCategory = async (req, res) => {

    try {

        const { categoryId } = req.params

        const userId = req.user.id


        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }


        if (!categoryId) {
            return res.status(400).json("CategoryId didn't found")
        }


        /*
        ========================================
        CHECK WHETHER CATEGORY HAS EXPENSES
        ========================================
        */

        const expenses = await pool.query(
            `
            SELECT id
            FROM expenses
            WHERE category_id=$1
            AND user_id=$2
            LIMIT 1
            `,
            [categoryId, userId]
        )


        if (expenses.rows.length > 0) {

            return res.status(400).json(
                "Cannot delete category because it has expenses"
            )
        }


        /*
        ========================================
        DELETE CATEGORY
        ========================================
        */

        const result = await pool.query(
            `
            DELETE FROM categories
            WHERE id=$1
            AND user_id=$2
            RETURNING id
            `,
            [categoryId, userId]
        )


        if (result.rows.length === 0) {

            return res.status(404).json(
                "Category not found"
            )
        }


        return res.status(200).json({
            id: result.rows[0].id
        })

    } catch (error) {

        console.error("Delete Category Error:", error)

        return res.status(500).json({
            error: "DeleteCategory Error"
        })
    }
}



// ========================================
// GET CATEGORY SPENDING
// ========================================

const getCategorySpending = async (req, res) => {

    try {

        const userId = req.user.id


        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }


        const result = await pool.query(
            `
            SELECT
                c.id,
                c.name,
                COALESCE(SUM(e.amount), 0) AS total_spending

            FROM categories c

            LEFT JOIN expenses e
                ON c.id = e.category_id
                AND e.user_id = $1

            WHERE c.user_id = $1

            GROUP BY c.id, c.name

            ORDER BY total_spending DESC
            `,
            [userId]
        )


        return res.status(200).json(result.rows)

    } catch (error) {

        console.error(
            "Get Category Spending Error:",
            error
        )

        return res.status(500).json({
            error: "getCategorySpending Error"
        })
    }
}


export {
    addCategory,
    getCategory,
    deleteCategory,
    getCategorySpending
}