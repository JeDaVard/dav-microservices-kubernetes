export {}

export interface UserPayload {
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
