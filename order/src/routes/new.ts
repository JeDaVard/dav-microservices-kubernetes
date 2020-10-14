import express, { Request, Response } from 'express'
import { Types } from 'mongoose'
import { requireAuth } from '@kuber-ticket/micro-auth'
import { body } from 'express-validator'
import { validateRequest } from '@kuber-ticket/micro-auth/build'

const router = express.Router()

router.post(
    '/',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => Types.ObjectId.isValid(input))
            .withMessage('Ticket id is required to make an order'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        res.status(201).send({})
    },
)

export { router }
