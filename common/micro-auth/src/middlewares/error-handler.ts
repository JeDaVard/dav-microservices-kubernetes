import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/error-interfaces'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) return res.status(err.code).send({ errors: err.serialize() })

    console.error(err)
    res.status(500).send({
        errors: [{ message: 'Something went wrong!' }],
    })
}
