import express, { Request, Response } from 'express'
import { Order } from '../models/order'
import { NotFoundError, requireAuth, NotAuthorizedError } from '@kuber-ticket/micro-auth'

const router = express.Router()

router.get('/', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.user!.id }).populate('ticket')
    res.status(200).send(orders)
})

router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    const order = await Order.findById(id).populate('ticket')
    if (!order) throw new NotFoundError()
    if (order.userId.toString() !== req.user!.id) throw new NotAuthorizedError()

    res.status(200).send(order)
})

export { router }
