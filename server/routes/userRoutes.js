import express, { Router } from 'express'
import { getUsers, getUserById } from '../controllers/userController.js'

const router = Router()

router.get("/users", getUsers)
router.get("/users/:userId", getUserById)

export default router