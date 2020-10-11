import { CustomError } from './error-interfaces'

export class NotAuthorizedError extends CustomError {
    code = 401
    constructor() {
        super('Not authorized')

        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
    serialize() {
        return [{ message: 'Not authorized' }]
    }
}
