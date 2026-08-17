import pool from "../db/db.js";

const addCategory = async (req,res)=>{
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

    const {categoryName} = req.body

    if (!categoryName)
    {
       return res.status(400).json("categoryName not found")
    }

    const category = await pool.query(
    "SELECT * FROM categories WHERE name=$1 AND user_id=$2",
    [categoryName, userId]
)
    
    if (category.rows.length > 0)
    {
        return res.status(400).json("Category already exists")
    }
    
        const result = await pool.query(
    "INSERT INTO categories(name,user_id) VALUES($1,$2) RETURNING id,name,user_id",
    [categoryName, userId]
)
    
    return res.status(201).json(result.rows[0])

    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "AddCategory Error" });
    }
}

const getCategory = async (req,res)=>{
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

    const result = await pool.query("SELECT * FROM categories WHERE user_id=$1",[userId])

    return res.status(201).json(result.rows)

    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "GetCategory Error" });
    }
}

const deleteCategory = async(req,res) =>{
    try {
        const { categoryId } = req.params

const userId = req.user.id

        if (!userId)
        {
           return res.status(400).json("UserId didn't found")
        }

        if (!categoryId)
        {
            return res.status(400).json("CategoryId didn't found")
        }

       const result = await pool.query("DELETE FROM categories WHERE id=$1 AND user_id=$2",[categoryId,userId])

        if (result.rows.length === 0)
{
    return res.status(404).json("Category not found")
}

return res.status(200).json(result.rows[0])

    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "DeleteCategory Error" });
    }
}

const getCategorySpending = async(req,res)=>{
    try {
             const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        const result = await pool.query(
            `SELECT
                c.id,
                c.name,
                COALESCE(SUM(e.amount), 0) AS total_spending
             FROM categories c
             LEFT JOIN expenses e
                ON c.id = e.category_id
                AND e.user_id = $1
             WHERE c.user_id = $1
             GROUP BY c.id, c.name
             ORDER BY total_spending DESC`,
            [userId]
        )

        return res.status(200).json(result.rows)
    } catch (error) {
                console.error(error);
    res.status(500).json({ error: "getCategorySpending Error" });
    }
}

export {addCategory , getCategory ,deleteCategory , getCategorySpending};