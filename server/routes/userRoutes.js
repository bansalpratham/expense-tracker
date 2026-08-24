import {
    Router
} from "express"


import {
    getUsers,
    getUserById,
    getCurrentUser,
    updateCurrentUser
} from "../controllers/userController.js"


import authMiddleware from "../middleware/authMiddleware.js"


const router = Router()


/*
========================================
CURRENT LOGGED-IN USER
========================================
*/

router.get(
    "/users/me",
    authMiddleware,
    getCurrentUser
)


/*
========================================
UPDATE CURRENT LOGGED-IN USER
========================================
*/

router.put(
    "/users/me",
    authMiddleware,
    updateCurrentUser
)


/*
========================================
GET ALL USERS
========================================
*/

router.get(
    "/users",
    getUsers
)


/*
========================================
GET USER BY ID
========================================
*/

router.get(
    "/users/:id",
    authMiddleware,
    getUserById
)


export default router