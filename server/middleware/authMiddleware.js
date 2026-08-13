import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json("Authorization header required")
        }

        const parts = authHeader.split(" ")

        if (parts[0] !== "Bearer" || !parts[1]) {
            return res.status(401).json("Invalid authorization header")
        }

        const token = parts[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {
        console.error(error)
        return res.status(401).json("Invalid or expired token")
    }
}

export default authMiddleware