import pool from "../db/db.js"


/*
========================================
GET NOTIFICATIONS
========================================
*/

export const getNotifications = async (req, res) => {

    try {

        const userId = req.user.id


        const result = await pool.query(
            `
            SELECT
                id,
                title,
                message,
                type,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        )


        res.status(200).json(
            result.rows
        )

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        )

        res.status(500).json({
            message: "Failed to fetch notifications"
        })

    }

}


/*
========================================
MARK ONE AS READ
========================================
*/

export const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        const userId = req.user.id

        const notificationId =
            req.params.id


        const result = await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1
            AND user_id = $2
            RETURNING *
            `,
            [
                notificationId,
                userId
            ]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Notification not found"
            })

        }


        res.status(200).json(
            result.rows[0]
        )

    } catch (error) {

        console.error(
            "Mark notification error:",
            error
        )

        res.status(500).json({
            message: "Failed to mark notification as read"
        })

    }

}


/*
========================================
MARK ALL AS READ
========================================
*/

export const markAllNotificationsAsRead = async (
    req,
    res
) => {

    try {

        const userId = req.user.id


        await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = $1
            `,
            [userId]
        )


        res.status(200).json({
            message: "All notifications marked as read"
        })

    } catch (error) {

        console.error(
            "Mark all notifications error:",
            error
        )

        res.status(500).json({
            message: "Failed to mark notifications as read"
        })

    }

}


/*
========================================
DELETE NOTIFICATION
========================================
*/

export const deleteNotification = async (
    req,
    res
) => {

    try {

        const userId = req.user.id

        const notificationId =
            req.params.id


        const result = await pool.query(
            `
            DELETE FROM notifications
            WHERE id = $1
            AND user_id = $2
            RETURNING id
            `,
            [
                notificationId,
                userId
            ]
        )


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Notification not found"
            })

        }


        res.status(200).json({
            message: "Notification deleted successfully"
        })

    } catch (error) {

        console.error(
            "Delete notification error:",
            error
        )

        res.status(500).json({
            message: "Failed to delete notification"
        })

    }

}