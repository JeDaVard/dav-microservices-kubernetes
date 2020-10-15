import express, { Request, Response } from 'express'
import { Order } from '../models/order'
import { requireAuth } from '@kuber-ticket/micro-auth/build'

const router = express.Router()

router.get('/', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.user!.id }).populate('ticket')
    res.status(200).send(orders)
})

router.get('/:id', async (req: Request, res: Response) => {
    res.status(200).send({})
})

export { router }
