import { Request, Response, NextFunction } from 'express'
import { DatabaseConnectionError, RequestValidationError } from '../errors'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof DatabaseConnectionError) console.log('Handling a DB error')
    if (err instanceof RequestValidationError) console.log('Handling validation error')

    res.status(500).send({
        message: 'Something went wrong!',
    })
}
