import express from 'express'
import cors from 'cors'
import "dotenv/config"

import pool from './db/db.js'

import router from './routes/userRoutes.js'
import router1 from './routes/authRoutes.js'
import router2 from './routes/categoryRoutes.js'
import router3 from './routes/expenseRoutes.js'
import router4 from './routes/budgetRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'


const app = express()


app.use(cors())

app.use(express.json())


app.get("/", (req, res) => {

    res.send("Expense Tracker API Running")

})


const port = process.env.PORT || 3000


app.use(router)

app.use(router1)

app.use(router2)

app.use(router3)

app.use(router4)

app.use("/notifications", notificationRouter)


app.listen(port, async () => {

    console.log(
        `server is running on port ${port}`
    )

})