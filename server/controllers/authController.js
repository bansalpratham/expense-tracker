import pool from "../db/db.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const SignUp = async (req,res)=>{
try {
const {email , password , userName} = req.body

    if (!email)
    {
       return res.status(400).json("Email Required")
    }

    if (!password)
    {
       return res.status(400).json("Password Required")
    }

    if (!userName)
    {
       return res.status(400).json("userName Required")
    }

    const existingUser = await pool.query("SELECT * FROM users WHERE email=$1" , [email])

    if (existingUser.rows.length > 0)
    {
        return res.status(400).json("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const result = await pool.query(
`INSERT INTO users (username, email, password)
 VALUES ($1, $2, $3)
 RETURNING id, username, email`,
[userName, email, hashedPassword]
);

return res.status(200).json(result.rows)

} catch (error) {
    console.error(error);
    res.status(500).json({ error: "SignUp error" });
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

export {SignUp , SignIn };