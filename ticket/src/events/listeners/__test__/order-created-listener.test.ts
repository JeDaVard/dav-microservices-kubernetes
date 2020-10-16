import { OrderCreatedListener } from '../order-created-listener'
import { nats, OrderCreatedEvent, OrderStatus, Message } from '@kuber-ticket/micro-events'
import Ticket from '../../../models/ticket'
import { Types } from 'mongoose'

const setup = async () => {
    // create a listener
    const listener = new OrderCreatedListener(nats.client)

    // create and save ticket
    const ticket = Ticket.build({
        title: 'Some',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    })
    await ticket.save()

    // create fake order data
    const data: OrderCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        userId: ticket.userId,
        version: 0,
        status: OrderStatus.Created,
        expiresAt: 'adf',
        ticket: {
            id: ticket._id,
            price: ticket.price,
        },
    }

    // @ts-ignore
    const msg: Message = { ack: jest.fn() }

    return { listener, ticket, data, msg }
}

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const reservedTicket = await Ticket.findById(ticket.id)

    expect(reservedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes ticket update event', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(nats.client.publish).toHaveBeenCalled()
})

it('published event has been defined in the call stack', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const currentCallOrderId = (nats.client.publish as jest.Mock).mock.calls.find((call) => {
        return JSON.parse(call[1]).orderId === data.id
    })

    expect(currentCallOrderId).toBeDefined()
})
