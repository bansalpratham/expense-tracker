import express, { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBudget, deleteBudget, getBudget, updateBudget } from '../controllers/budgetController.js';

const router4 = Router()

router4.post("/addBudget" , authMiddleware , addBudget);
router4.get("/getBudget" , authMiddleware , getBudget);
router4.delete("/deleteBudget/:budgetId" , authMiddleware , deleteBudget);
router.put("/updateBudget/:budgetId", authMiddleware, updateBudget)

export default router4