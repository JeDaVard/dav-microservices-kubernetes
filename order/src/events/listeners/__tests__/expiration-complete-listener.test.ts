import { nats, OrderStatus, Message, ExpirationCompleteEvent } from '@kuber-ticket/micro-events'
import { Types } from 'mongoose'

import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    const listener = new ExpirationCompleteListener(nats.client)

    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'some',
        price: 1,
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket,
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn,
    }

    return { msg, data, order, listener, ticket }
}

it('updates the order status to canceled', async () => {
    const { msg, data, order, listener, ticket } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
    const { msg, data, order, listener, ticket } = await setup()

    await listener.onMessage(data, msg)

    // const eventData = JSON.parse((nats.client.publish as jest.Mock).mock.calls[0][1])
    const currentCalled = (nats.client.publish as jest.Mock).mock.calls
        .map((call) => {
            return JSON.parse(call[1])
        })
        .find((call) => call.id === order.id)

    expect(nats.client.publish).toHaveBeenCalled()
    expect(currentCalled).toBeDefined()
})
