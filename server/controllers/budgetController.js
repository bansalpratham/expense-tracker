const addBudget = async (req,res)=>{
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(400).json("UserId didn't found")
        }

        const user = await pool.query("SELECT * FROM users WHERE id=$1", [userId])

        if (user.rows.length === 0) {
            return res.status(400).json("User didn't found")
        }

        

    } catch (error) {
        
    }
}