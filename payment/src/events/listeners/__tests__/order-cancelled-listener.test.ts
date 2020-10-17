import { OrderCancelledEvent, nats, Message, OrderStatus } from '@kuber-ticket/micro-events'
import { Types } from 'mongoose'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Order } from '../../../models/order'

const setup = async () => {
    const listener = new OrderCancelledListener(nats.client)

    // create new order
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        version: 0,
        userId: new Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created,
    })
    await order.save()

    const data: OrderCancelledEvent['data'] = {
        id: order._id,
        version: 1,
        ticket: {
            id: new Types.ObjectId().toHexString(),
        },
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, order, msg }
}

it('throws an error if order is not found', async (done) => {
    const { listener, data, order, msg } = await setup()

    data.id = new Types.ObjectId().toHexString()

    try {
        await listener.onMessage(data, msg)
    } catch (e) {
        return done()
    }
})

it('changes the order status to cancelled', async () => {
    const { listener, data, order, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order._id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
