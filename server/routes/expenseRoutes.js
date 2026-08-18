import express, { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addExpense, deleteExpense, getDashboard, getExpense, getExpenseByDate } from '../controllers/expenseController.js'

const router3 = Router()

router3.post("/addExpense" , authMiddleware , addExpense)
router3.get("/getExpense" , authMiddleware , getExpense)
router3.delete("/deleteExpense/:expenseId" , authMiddleware , deleteExpense)
router3.get("/getExpenseByDate",authMiddleware,getExpenseByDate)
router3.get("/dashboard",authMiddleware,getDashboard)

export default router3