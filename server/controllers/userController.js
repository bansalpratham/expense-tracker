import pool from "../db/db.js"


/*
========================================
GET ALL USERS
========================================
*/

const getUsers = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                id,
                username,
                email,
                created_at
             FROM users`
        )


        res.status(200).json(
            result.rows
        )


    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "Server error"
        })

    }

}


/*
========================================
GET USER BY ID
========================================
*/

const getUserById = async (req, res) => {

    try {

        const { id } = req.params


        const result = await pool.query(
            `SELECT
                id,
                username,
                email,
                created_at
             FROM users
             WHERE id = $1`,
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
========================================
GET CURRENT LOGGED-IN USER
========================================
*/

const getCurrentUser = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                id,
                username,
                email,
                created_at
             FROM users
             WHERE id = $1`,
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
========================================
UPDATE CURRENT LOGGED-IN USER
========================================
*/

const updateCurrentUser = async (req, res) => {

    try {

        const {
            username,
            email
        } = req.body


        /*
        ================================
        VALIDATION
        ================================
        */

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
        ================================
        CHECK EMAIL
        ================================
        */

        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1
             AND id != $2`,
            [
                cleanEmail,
                req.user.id
            ]
        )


        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                error: "Email already exists"
            })

        }


        /*
        ================================
        UPDATE USER
        ================================
        */

        const result = await pool.query(
            `UPDATE users
             SET
                username = $1,
                email = $2
             WHERE id = $3
             RETURNING
                id,
                username,
                email,
                created_at`,
            [
                cleanUsername,
                cleanEmail,
                req.user.id
            ]
        )


        /*
        ================================
        USER NOT FOUND
        ================================
        */

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            })

        }


        /*
        ================================
        RETURN UPDATED USER
        ================================
        */

        res.status(200).json(
            result.rows[0]
        )


    } catch (error) {

        console.error(error)


        /*
        ================================
        POSTGRES UNIQUE ERROR
        ================================
        */

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Email already exists"
            })

        }


        res.status(500).json({
            error: "Failed to update profile"
        })

    }

}


export {
    getUsers,
    getUserById,
    getCurrentUser,
    updateCurrentUser
}