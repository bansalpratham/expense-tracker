import express, { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

const router4 = Router()

router4.post("/addBudget" , authMiddleware , addBudget);

export default router4