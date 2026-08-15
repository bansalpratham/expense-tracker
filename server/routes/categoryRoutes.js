import express, { Router } from 'express'
import { addCategory, deleteCategory, getCategory } from '../controllers/categoryController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router2 = Router()

router2.post("/addCategory", authMiddleware ,addCategory)
router2.get("/getCategory", authMiddleware ,getCategory)
router2.delete("/deleteCategory/:categoryId", authMiddleware, deleteCategory)

export default router2