import express, { Request, Response } from 'express'
import { requireAuth, BadRequestError, NotFoundError } from '@kuber-ticket/micro-auth'
import { OrderStatus, nats } from '@kuber-ticket/micro-events'

import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

const router = express.Router()

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id

    const order = await Order.findById(id)
    if (!order) throw new NotFoundError()
    if (order.userId.toString() !== req.user!.id) throw new BadRequestError()

    order.status = OrderStatus.Cancelled
    await order.save()

    await new OrderCancelledPublisher(nats.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    })

    res.status(200).send(order)
})

export { router }
