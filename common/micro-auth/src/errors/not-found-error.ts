import { CustomError } from './error-interfaces'

export class NotFoundError extends CustomError {
    constructor() {
        super('Not Found!')

        // Only because we are extending a build-in class
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    code = 404
    serialize() {
        return [{ message: 'Not found!' }]
    }
}
