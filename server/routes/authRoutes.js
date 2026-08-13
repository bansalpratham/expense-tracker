import express, { Router } from 'express'
import { SignIn, SignUp , SignInWithGoogle } from '../controllers/authController.js'

const router1 = Router()

router1.post("/auth/signup" , SignUp)
router1.post("/auth/signin" , SignIn)
router1.post("/auth/google", SignInWithGoogle)

export default router1