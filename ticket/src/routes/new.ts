import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@kuber-ticket/micro-auth'
import { body } from 'express-validator'
import Ticket from '../models/ticket'

const router = express.Router()

router.post(
    '/',
    requireAuth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Number must be positive number'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body

        let ticket = Ticket.build({ title, price, userId: req.user!.id })

        res.status(201).send(ticket)
    },
)

export { router }
