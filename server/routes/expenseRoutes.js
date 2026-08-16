import express, { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addExpense, deleteExpense, getExpense } from '../controllers/expenseController.js'

const router3 = Router()

router3.post("/addExpense" , authMiddleware , addExpense)
router3.get("/getExpense" , authMiddleware , getExpense)
router3.delete("/deleteExpense/:expenseId" , authMiddleware , deleteExpense)

export default router3