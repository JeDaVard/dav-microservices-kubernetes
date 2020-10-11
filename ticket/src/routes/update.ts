import express, { Request, Response } from 'express'
import {
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    NotFoundError,
} from '@kuber-ticket/micro-auth'
import { body } from 'express-validator'
import Ticket from '../models/ticket'

const router = express.Router()

router.put(
    '/:id',
    requireAuth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Number must be positive number'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) throw new NotFoundError()
        if (ticket.userId.toString() !== req.user!.id) throw new NotAuthorizedError()

        ticket.set({ title: req.body.title, price: req.body.price })
        await ticket.save()
        res.status(200).send(ticket)
    },
)

export { router }
