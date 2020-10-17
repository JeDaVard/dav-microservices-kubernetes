import {
    Subjects,
    Listener,
    PaymentCreatedEvent,
    Message,
    OrderStatus,
} from '@kuber-ticket/micro-events'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = queueGroupName
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId)
        if (!order) throw new Error('Order was removed before payment succeed')

        order.set({ status: OrderStatus.Fulfilled })
        await order.save()

        msg.ack()
    }
}
