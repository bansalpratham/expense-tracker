import pool from "../db/db.js"

const addBudget = async (req, res) => {

    try {

        const userId = req.user.id

        if (!userId) {
            return res.status(400).json(
                "UserId didn't found"
            )
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [userId]
        )

        if (user.rows.length === 0) {
            return res.status(400).json(
                "User didn't found"
            )
        }

        const { amount, type } = req.body

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {
            return res.status(400).json(
                "Valid amount is required"
            )
        }

        if (
            !["weekly", "monthly"].includes(type)
        ) {
            return res.status(400).json(
                "Type must be weekly or monthly"
            )
        }

        const existingBudget = await pool.query(
            `SELECT *
             FROM budget
             WHERE user_id=$1
             AND type=$2`,
            [userId, type]
        )

        if (existingBudget.rows.length > 0) {
            return res.status(400).json(
                "Budget already exists"
            )
        }

        const result = await pool.query(
            `INSERT INTO budget
                (amount, type, user_id)
             VALUES
                ($1, $2, $3)
             RETURNING id, amount, type, user_id`,
            [
                amount,
                type,
                userId
            ]
        )

        return res.status(201).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(error)

        return res.status(500).json({
            error: "AddBudget Error"
        })
    }
}

const getBudget = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [userId]
        )

        if (user.rows.length === 0) {
            return res.status(400).json("User didn't found")
        }

        const result = await pool.query(
    "SELECT * FROM budget WHERE user_id=$1",
    [userId]
)

        return res.status(200).json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "GetBudget Error" })
    }
}

const deleteBudget = async (req, res) => {
    try {
        const { budgetId } = req.params

        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        if (!budgetId) {
            return res.status(400).json("BudgetId didn't found")
        }

        const result = await pool.query(
            `DELETE FROM budget
             WHERE id=$1 AND user_id=$2
             RETURNING id, amount, type, user_id`,
            [budgetId, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json("Budget not found")
        }

        return res.status(200).json(result.rows[0])

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "DeleteBudget Error" })
    }
}

const updateBudget = async (req, res) => {

    try {

        const { budgetId } = req.params
        const userId = req.user.id

        if (!userId) {
            return res.status(400).json(
                "UserId didn't found"
            )
        }

        if (!budgetId) {
            return res.status(400).json(
                "BudgetId didn't found"
            )
        }

        const { amount } = req.body

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {
            return res.status(400).json(
                "Valid amount is required"
            )
        }

        const result = await pool.query(
            `UPDATE budget
             SET amount=$1
             WHERE id=$2
             AND user_id=$3
             RETURNING id, amount, type, user_id`,
            [
                amount,
                budgetId,
                userId
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json(
                "Budget not found"
            )
        }

        return res.status(200).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(error)

        return res.status(500).json({
            error: "UpdateBudget Error"
        })
    }
}

export { addBudget , getBudget  , deleteBudget , updateBudget }