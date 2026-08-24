import { Router } from "express"

import {
    getUsers,
    getUserById,
    getCurrentUser,
    updateCurrentUser,
    changePassword,
    deleteCurrentUser
} from "../controllers/userController.js"

import authMiddleware from "../middleware/authMiddleware.js"


const router = Router()


/*
==================================================
CURRENT USER
==================================================
*/

router.get(
    "/users/me",
    authMiddleware,
    getCurrentUser
)


/*
==================================================
UPDATE PROFILE
==================================================
*/

router.put(
    "/users/me",
    authMiddleware,
    updateCurrentUser
)


/*
==================================================
CHANGE PASSWORD
==================================================
*/

router.put(
    "/users/me/password",
    authMiddleware,
    changePassword
)


/*
==================================================
DELETE ACCOUNT
==================================================
*/

router.delete(
    "/users/me",
    authMiddleware,
    deleteCurrentUser
)


/*
==================================================
GET ALL USERS
==================================================
*/

router.get(
    "/users",
    getUsers
)


/*
==================================================
GET USER BY ID
==================================================
*/

router.get(
    "/users/:id",
    authMiddleware,
    getUserById
)


export default router