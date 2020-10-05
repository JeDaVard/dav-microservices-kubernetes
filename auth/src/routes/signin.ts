import express, { Response, Request, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post(
    '/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('You must provide 4-20 character password'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400).send(errors.array())
                return
            }

            res.status(200).send('Sign In')
        } catch (e) {
            next(e)
        }
    },
)

export { router }
