import express, { Response, Request } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@kuber-ticket/micro-auth'

import { User } from '../models/user'
import { Password } from '../service/password'

const router = express.Router()

router.post(
    '/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must provide 4-20 character password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (!existingUser) throw new BadRequestError("User doesn't exist")

        const passwordsMatch = await Password.compare(existingUser.password, password)
        if (!passwordsMatch) throw new BadRequestError('Invalid password')

        const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET!, {})

        req.session = { jwt: token }

        res.status(200).send(existingUser)
    },
)

export { router }
