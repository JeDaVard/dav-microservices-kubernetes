import { nats, Message, TicketCreatedEvent } from '@kuber-ticket/micro-events'
import { TicketCreatedListener } from '../ticket-created-listener'
import { Types } from 'mongoose'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    // create and instance of listener
    const listener = new TicketCreatedListener(nats.client)

    // create a fake event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new Types.ObjectId().toHexString(),
        title: 'Some title',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    }

    // create a fake message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup()

    // call the onMessage function with data object + message obj
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
})
it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    // call the onMessage function with data object + message obj
    await listener.onMessage(data, msg)

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled()
})
