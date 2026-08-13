import express, { Router } from 'express'
import { SignIn, SignUp } from '../controllers/authController.js'

const router1 = Router()

router1.post("/auth/signup" , SignUp)
router1.post("/auth/signin" , SignIn)

export default router1