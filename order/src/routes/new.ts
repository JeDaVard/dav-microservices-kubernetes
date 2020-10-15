import express, { Request, Response } from 'express'
import { Types } from 'mongoose'
import {
    requireAuth,
    BadRequestError,
    NotFoundError,
    validateRequest,
} from '@kuber-ticket/micro-auth'
import { OrderStatus, nats } from '@kuber-ticket/micro-events'
import { body } from 'express-validator'

import { Ticket } from '../models/ticket'
import { Order } from '../models/order'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15

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
        const { ticketId } = req.body

        // Find the ticket
        const ticket = await Ticket.findById(ticketId)
        if (!ticket) throw new NotFoundError()

        // Make sure it is not already reserved
        const isReserved = await ticket.isReserved()
        if (isReserved) throw new BadRequestError('The ticket is already reserved')

        // Calculate an exp date for this order
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS)

        // Create the order
        const order = Order.build({
            expiresAt,
            ticket,
            status: OrderStatus.Created,
            userId: req.user!.id,
        })
        await order.save()

        // Publish an event saying that the order is created

        res.status(201).send(order)
    },
)

export { router }
