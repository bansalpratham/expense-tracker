import express from 'express'
import cors from 'cors'
import "dotenv/config";
import pool from './db/db.js'
import router from './routes/userRoutes.js'
import router1 from './routes/authRoutes.js'


const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Expense Tracker API Running")
});

const port = process.env.PORT || 3000;

app.use(router)
app.use(router1)

app.listen(port , async ()=>{
    console.log(`server is running on port ${port}`)
})