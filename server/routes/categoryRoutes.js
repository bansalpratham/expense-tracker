import express, { Router } from 'express'
import { addCategory } from '../controllers/categoryController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router2 = Router()

router2.post("/addCategory", authMiddleware ,addCategory)

export default router2