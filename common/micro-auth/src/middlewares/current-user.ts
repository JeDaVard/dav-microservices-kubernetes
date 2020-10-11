import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface UserPayload {
    id: string
    email: string
    createdAt: string
    updatedAt: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}
// Or you can do this way
// export interface ExtendedRequest extends Request {
//     [key: string]: any
// }

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) return next()

    try {
        req.user = jwt.verify(req.session.jwt, process.env.JWT_SECRET!) as UserPayload
    } catch (e) {}
    next()
}
