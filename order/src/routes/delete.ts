import express, { Request, Response } from 'express'
import { requireAuth, BadRequestError, NotFoundError } from '@kuber-ticket/micro-auth'
import { Order } from '../models/order'
import { OrderStatus } from '@kuber-ticket/micro-events'

const router = express.Router()

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id

    const order = await Order.findById(id)
    if (!order) throw new NotFoundError()
    if (order.userId.toString() !== req.user!.id) throw new BadRequestError()

    order.status = OrderStatus.Canceled
    await order.save()

    res.status(200).send(order)
})

export { router }
