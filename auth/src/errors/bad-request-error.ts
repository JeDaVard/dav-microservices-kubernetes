import { CustomError } from './error-interfaces'

export class BadRequestError extends CustomError {
    constructor(public reason: string = 'Bad Request!') {
        super('Not Found!')

        // Only because we are extending a build-in class
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    code = 400
    serialize() {
        return [{ message: this.reason }]
    }
}
