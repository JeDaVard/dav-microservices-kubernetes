import { ValidationError } from 'express-validator'
import { CustomError } from './error-interfaces'

export class RequestValidationError extends CustomError {
    constructor(public errors: ValidationError[], public code: number = 400) {
        super('Unknown validation error')

        // Only because we are extending a build-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    serialize() {
        return this.errors.map((err) => {
            return {
                message: err.msg,
                field: err.param,
            }
        })
    }
}
