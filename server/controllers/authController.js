import pool from "../db/db.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";
import { getAuth } from "firebase-admin/auth";

const SignUp = async (req, res) => {

    try {

        const { email, password, userName } = req.body


        if (!email) {
            return res.status(400).json("Email Required")
        }

        if (!password) {
            return res.status(400).json("Password Required")
        }

        if (!userName) {
            return res.status(400).json("userName Required")
        }


        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        )


        if (existingUser.rows.length > 0) {
            return res.status(400).json("Email already exists")
        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        )


        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [
                userName,
                email,
                hashedPassword
            ]
        )


        const user = result.rows[0]


        /*
        ================================================
        CREATE JWT AFTER SIGNUP
        ================================================
        */

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )


        /*
        ================================================
        SEND USER + TOKEN
        ================================================
        */

        return res.status(200).json({

            id: user.id,

            username: user.username,

            email: user.email,

            token: token

        })


    } catch (error) {

        console.error(error)

        return res.status(500).json({
            error: "SignUp error"
        })

    }

}


const SignIn = async (req,res)=>{
try {

    const {email , password} = req.body

    if (!email)
    {
       return res.status(400).json("Email Required")
    }

    if (!password)
    {
       return res.status(400).json("Password Required")
    }

    const existingUser = await pool.query("SELECT * FROM users WHERE email=$1" , [email])

    if (existingUser.rows.length === 0) {
        return res.status(400).json("User does not exist")
    }

    const currentPassword = existingUser.rows[0].password;

    const check = await bcrypt.compare(password , currentPassword);

    if(!check)
    {
        return res.status(400).json("Password not Matching")
    }

    const token = jwt.sign(
        { id: existingUser.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        id: existingUser.rows[0].id,
        username: existingUser.rows[0].username,
        email: existingUser.rows[0].email,
        token: token
    })

} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
}

}


const SignInWithGoogle = async (req, res) => {
    try {

        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json("Google ID Token Required");
        }

        const decodedToken = await getAuth().verifyIdToken(idToken);

        const googleId = decodedToken.uid;
        const email = decodedToken.email;
        const userName = decodedToken.name || email.split("@")[0];

        if (!email) {
            return res.status(400).json("Google account email not found");
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        let user;

        if (existingUser.rows.length === 0) {

            const result = await pool.query(
                `INSERT INTO users (username, email, password, google_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, username, email, google_id`,
                [userName, email, null, googleId]
            );

            user = result.rows[0];

        } else {

            user = existingUser.rows[0];

            if (!user.google_id) {

                const result = await pool.query(
                    `UPDATE users
                     SET google_id=$1
                     WHERE id=$2
                     RETURNING id, username, email, google_id`,
                    [googleId, user.id]
                );

                user = result.rows[0];
            }
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            error: "Google authentication failed"
        });
    }
}


export {SignUp , SignIn, SignInWithGoogle };