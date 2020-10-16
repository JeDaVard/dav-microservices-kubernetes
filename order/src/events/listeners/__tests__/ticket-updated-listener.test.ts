import { nats, Message, TicketUpdatedEvent } from '@kuber-ticket/micro-events'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { Types } from 'mongoose'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    // create and instance of listener
    const listener = new TicketUpdatedListener(nats.client)

    // create a ticket
    const ticket = Ticket.build({
        title: 'Some1',
        price: 1,
        id: new Types.ObjectId().toHexString(),
    })
    await ticket.save()

    // create a fake event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket._id,
        title: 'New title',
        price: 2,
        version: ticket.version + 1,
        userId: new Types.ObjectId().toHexString(),
    }

    // create a fake message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, data, msg, ticket }
}

it('finds, updates and saves the ticket', async () => {
    const { listener, data, msg, ticket } = await setup()

    // call the onMessage function with data object + message obj
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket._id)

    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.title).toEqual(data.title)
})

it('does not update the ticket if the event version is higher than expected', async (done) => {
    const { listener, data, msg } = await setup()

    // call the onMessage function with data object + message obj
    const nextData = { ...data, version: data.version + 1 }

    try {
        await listener.onMessage(nextData, msg)
    } catch (e) {}
    expect(msg.ack).not.toHaveBeenCalled()
    done()
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    // call the onMessage function with data object + message obj
    await listener.onMessage(data, msg)

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled()
})
