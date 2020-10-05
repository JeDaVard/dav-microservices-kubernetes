import express, { Response, Request, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors'

const router = express.Router()

router.post(
    '/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('You must provide 4-20 character password'),
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }

        res.status(200).send('Sign In')
    },
)

export { router }
