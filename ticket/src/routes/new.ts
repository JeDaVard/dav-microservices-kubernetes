import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@kuber-ticket/micro-auth'
import { nats } from '@kuber-ticket/micro-events'
import { body } from 'express-validator'
import Ticket from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

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
        await ticket.save()
        await new TicketCreatedPublisher(nats.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        })

        res.status(201).send(ticket)
    },
)

export { router }
