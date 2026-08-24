import pool from "../db/db.js"
import bcrypt from "bcrypt"


/*
==================================================
GET ALL USERS
==================================================
*/

const getUsers = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                created_at
            FROM users
            ORDER BY id
            `
        )

        res.status(200).json(result.rows)

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Server error"
        })

    }

}


/*
==================================================
GET USER BY ID
==================================================
*/

const getUserById = async (req, res) => {

    try {

        const { id } = req.params


        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                created_at
            FROM users
            WHERE id = $1
            `,
            [id]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            })

        }


        res.status(200).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Server error"
        })

    }

}


/*
==================================================
GET CURRENT USER
==================================================
*/

const getCurrentUser = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                created_at
            FROM users
            WHERE id = $1
            `,
            [req.user.id]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            })

        }


        res.status(200).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Server error"
        })

    }

}


/*
==================================================
UPDATE CURRENT USER
==================================================
*/

const updateCurrentUser = async (req, res) => {

    try {

        const {
            username,
            email
        } = req.body


        if (!username || !username.trim()) {

            return res.status(400).json({
                error: "Username is required"
            })

        }


        if (!email || !email.trim()) {

            return res.status(400).json({
                error: "Email is required"
            })

        }


        const cleanUsername = username.trim()
        const cleanEmail = email.trim().toLowerCase()


        /*
        ==========================================
        CHECK EMAIL
        ==========================================
        */

        const existingEmail = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            AND id != $2
            `,
            [
                cleanEmail,
                req.user.id
            ]
        )


        if (existingEmail.rows.length > 0) {

            return res.status(400).json({
                error: "Email already exists"
            })

        }


        /*
        ==========================================
        UPDATE USER
        ==========================================
        */

        const result = await pool.query(
            `
            UPDATE users
            SET
                username = $1,
                email = $2
            WHERE id = $3
            RETURNING
                id,
                username,
                email,
                created_at
            `,
            [
                cleanUsername,
                cleanEmail,
                req.user.id
            ]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            })

        }


        res.status(200).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Failed to update profile"
        })

    }

}


/*
==================================================
CHANGE PASSWORD
==================================================
*/

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body


        /*
        ==========================================
        VALIDATION
        ==========================================
        */

        if (!currentPassword) {

            return res.status(400).json({
                error: "Current password is required"
            })

        }


        if (!newPassword) {

            return res.status(400).json({
                error: "New password is required"
            })

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                error: "New password must be at least 6 characters"
            })

        }


        /*
        ==========================================
        GET CURRENT USER PASSWORD
        ==========================================
        */

        const result = await pool.query(
            `
            SELECT
                id,
                password
            FROM users
            WHERE id = $1
            `,
            [req.user.id]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            })

        }


        const user = result.rows[0]


        /*
        ==========================================
        GOOGLE ACCOUNT
        ==========================================
        */

        if (!user.password) {

            return res.status(400).json({
                error: "Google accounts cannot change password here"
            })

        }


        /*
        ==========================================
        CHECK CURRENT PASSWORD
        ==========================================
        */

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        )


        if (!passwordMatches) {

            return res.status(400).json({
                error: "Current password is incorrect"
            })

        }


        /*
        ==========================================
        HASH NEW PASSWORD
        ==========================================
        */

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        )


        /*
        ==========================================
        UPDATE PASSWORD
        ==========================================
        */

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            `,
            [
                hashedPassword,
                req.user.id
            ]
        )


        res.status(200).json({
            message: "Password changed successfully"
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Failed to change password"
        })

    }

}


/*
==================================================
DELETE CURRENT USER
==================================================
*/

const deleteCurrentUser = async (req, res) => {

    const client = await pool.connect()


    try {

        await client.query("BEGIN")


        /*
        ==========================================
        DELETE USER'S EXPENSES
        ==========================================
        */

        await client.query(
            `
            DELETE FROM expenses
            WHERE user_id = $1
            `,
            [req.user.id]
        )


        /*
        ==========================================
        DELETE USER'S BUDGETS
        ==========================================
        */

        await client.query(
            `
            DELETE FROM budgets
            WHERE user_id = $1
            `,
            [req.user.id]
        )


        /*
        ==========================================
        DELETE USER'S CATEGORIES
        ==========================================
        */

        await client.query(
            `
            DELETE FROM categories
            WHERE user_id = $1
            `,
            [req.user.id]
        )


        /*
        ==========================================
        DELETE USER
        ==========================================
        */

        const result = await client.query(
            `
            DELETE FROM users
            WHERE id = $1
            RETURNING id
            `,
            [req.user.id]
        )


        if (result.rows.length === 0) {

            await client.query("ROLLBACK")

            return res.status(404).json({
                error: "User not found"
            })

        }


        await client.query("COMMIT")


        res.status(200).json({
            message: "Account deleted successfully"
        })

    } catch (error) {

        await client.query("ROLLBACK")

        console.error(error)

        res.status(500).json({
            error: "Failed to delete account"
        })

    } finally {

        client.release()

    }

}


export {
    getUsers,
    getUserById,
    getCurrentUser,
    updateCurrentUser,
    changePassword,
    deleteCurrentUser
}