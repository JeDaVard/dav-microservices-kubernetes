import { OrderCreatedEvent, nats, Message, OrderStatus } from '@kuber-ticket/micro-events'
import { Types } from 'mongoose'
import { OrderCreatedListener } from '../order-created-listener'
import { Order } from '../../../models/order'

const setup = async () => {
    const listener = new OrderCreatedListener(nats.client)

    // create fake order data
    const data: OrderCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        version: 1,
        expiresAt: '',
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
        ticket: {
            id: new Types.ObjectId().toHexString(),
            price: 1,
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }
}

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('event listener creates correnct data', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order).toBeDefined()
})
