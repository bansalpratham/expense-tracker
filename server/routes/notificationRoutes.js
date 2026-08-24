import express from "express"

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notificationController.js"

import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router()


/*
========================================
GET NOTIFICATIONS
========================================
*/

router.get(
    "/",
    authMiddleware,
    getNotifications
)


/*
========================================
MARK ONE AS READ
========================================
*/

router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
)


/*
========================================
MARK ALL AS READ
========================================
*/

router.patch(
    "/read-all",
    authMiddleware,
    markAllNotificationsAsRead
)


/*
========================================
DELETE NOTIFICATION
========================================
*/

router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
)


export default router