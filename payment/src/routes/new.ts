import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { OrderStatus } from '@kuber-ticket/micro-events/'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
} from '@kuber-ticket/micro-auth'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'

const router = Router()

router.post(
    '/',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('Payment token must be provided'),
        body('orderId').not().isEmpty().withMessage('OrderId must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { orderId, token } = req.body

        const order = await Order.findById(orderId)
        if (!order) throw new NotFoundError()
        if (order.userId !== req.user!.id) throw new NotAuthorizedError()
        if (order.status === OrderStatus.Cancelled)
            throw new BadRequestError('Cannot pay for a cancelled order')

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            description: 'Kuber-ticket charge description',
            source: token,
        })

        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        })
        await payment.save()

        res.status(201).send({ success: true })
    },
)

export { router }
