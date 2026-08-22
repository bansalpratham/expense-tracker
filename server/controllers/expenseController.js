import pool from "../db/db.js"

const addExpense = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        const user = await pool.query("SELECT * FROM users WHERE id=$1", [userId])

        if (user.rows.length === 0) {
            return res.status(400).json("User didn't found")
        }

        const { amount, description, date, categoryId } = req.body

        if (!amount) {
            return res.status(400).json("Amount didn't found")
        }

        if (!description) {
            return res.status(400).json("Description didn't found")
        }

        if (!date) {
            return res.status(400).json("Date didn't found")
        }

        if (!categoryId) {
            return res.status(400).json("CategoryId didn't found")
        }

        const category = await pool.query(
    "SELECT * FROM categories WHERE id=$1 AND user_id=$2",
    [categoryId, userId]
)

if (category.rows.length==0)
{
return res.status(400).json("Category not found")
}


        const result = await pool.query(
            `INSERT INTO expenses
            (amount, description, date, user_id, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, amount, description, date, user_id, category_id`,
            [amount, description, date, userId, categoryId]
        )

        return res.status(201).json(result.rows[0])

    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "AddExpense Error" });
    }
}

const getExpense = async(req,res)=>{
    try {
        const userId = req.user.id

        if (!userId)
        {
           return res.status(400).json("UserId didn't found")
        }

        const user = await pool.query("SELECT * FROM users WHERE id=$1",[userId])

         if (user.rows.length === 0)
{
    return res.status(400).json("User didn't found")
}

    const result = await pool.query("SELECT * FROM expenses WHERE user_id=$1",[userId])

    return res.status(201).json(result.rows)

    } catch (error) {
               console.error(error);
    res.status(500).json({ error: "GetExpense Error" });
    }
}

const deleteExpense = async (req,res)=>{
    try {
        const {expenseId} = req.params

        const userId = req.user.id

        if (!userId)
        {
           return res.status(400).json("UserId didn't found")
        }

        if (!expenseId)
        {
            return res.status(400).json("ExpenseId didn't found")
        }
        
const result = await pool.query(
    `DELETE FROM expenses
     WHERE id=$1 AND user_id=$2
     RETURNING id, amount, description, date, user_id, category_id`,
    [expenseId, userId]
)

if (result.rows.length === 0) {
    return res.status(404).json("Expense not found")
}

return res.status(200).json(result.rows[0])

    } catch (error) {
         console.error(error);
    res.status(500).json({ error: "DeleteExpense Error" });
    }
}

const getExpenseByDate = async (req,res)=>{
    try {
         const userId = req.user.id

        if (!userId)
        {
           return res.status(400).json("UserId didn't found")
        }

        const {startDate , endDate} = req.query

        if (!startDate)
        {
            return res.status(400).json("startDate not provided")
        }

         if (!endDate)
        {
            return res.status(400).json("endDate not provided")
        }

        const result = await pool.query(
    `SELECT * FROM expenses
     WHERE user_id=$1
     AND date BETWEEN $2 AND $3`,
    [userId, startDate, endDate]
)

         if (result.rows.length === 0)
{
    return res.status(404).json("Expense not found")
}

        return res.status(200).json(result.rows)

    } catch (error) {
                 console.error(error);
    res.status(500).json({ error: "getExpenseByDate Error" });
    }
}

const getDashboard = async (req,res)=>{
    try {
         const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        const result = await pool.query(
    "SELECT SUM(amount) AS total_spending FROM expenses WHERE user_id=$1",
    [userId]
)

const monthlyBudget = await pool.query(
    "SELECT amount FROM budget WHERE user_id=$1 AND type=$2",
    [userId, "monthly"]
)

const monthlySpending = await pool.query(
    `SELECT SUM(amount) AS monthly_spending
     FROM expenses
     WHERE user_id=$1
     AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)`,
    [userId]
)

const totalSpending =
    Number(result.rows[0].total_spending || 0)

const monthlyBudgetAmount =
    Number(monthlyBudget.rows[0]?.amount || 0)

const monthlySpendingAmount =
    Number(monthlySpending.rows[0].monthly_spending || 0)

    const monthlyRemaining =
    monthlyBudgetAmount - monthlySpendingAmount

    const weeklyBudget = await pool.query(
    "SELECT amount FROM budget WHERE user_id=$1 AND type=$2",
    [userId, "weekly"]
)

const weeklyBudgetAmount =
    Number(weeklyBudget.rows[0]?.amount || 0)

    const weeklySpending = await pool.query(
    `SELECT SUM(amount) AS weekly_spending
     FROM expenses
     WHERE user_id=$1
     AND DATE_TRUNC('week', date) = DATE_TRUNC('week', CURRENT_DATE)`,
    [userId]
)

const weeklySpendingAmount =
    Number(weeklySpending.rows[0]?.weekly_spending || 0)

    const weeklyRemaining =
    weeklyBudgetAmount - weeklySpendingAmount

return res.status(200).json({
    totalSpending,
    
    monthly: {
        budget: monthlyBudgetAmount,
        spending: monthlySpendingAmount,
        remaining: monthlyRemaining
    },

    weekly: {
        budget: weeklyBudgetAmount,
        spending: weeklySpendingAmount,
        remaining: weeklyRemaining
    }
})

    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "getDashBoard Error" });
    }
}

export { addExpense , getExpense , deleteExpense , getExpenseByDate ,getDashboard };