import { CustomError } from './error-interfaces'

export class DatabaseConnectionError extends CustomError {
    constructor(public reason: string = 'Unknown db error', public code: number = 500) {
        super('Unknown db error')

        // Only because we are extending a build-in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serialize() {
        return [{ message: this.reason }]
    }
}
