import express, { Response, Request } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { DatabaseConnectionError } from '../errors'
import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'

const router = express.Router()

router.post(
    '/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Password can't be empty"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) throw new DatabaseConnectionError('User exists!', 400)

        const user = User.build({ email, password })
        await user.save()

        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET!, {})

        req.session = { jwt: token }

        res.status(201).send(user)
    },
)

export { router }
