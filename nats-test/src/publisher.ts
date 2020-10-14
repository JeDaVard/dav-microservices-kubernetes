import { connect } from 'node-nats-streaming'
import { TicketCreatePublisher } from './events/ticket-create-publisher'

const stan = connect('ticket', 'abc', {
    url: 'http://localhost:4222',
})

stan.on('connect', async () => {
    console.log('Publisher connected!')

    const publisher = new TicketCreatePublisher(stan)

    const data = {
        id: '2',
        title: 'Some title',
        price: 10,
        userId: 'u123',
    }
    try {
        await publisher.publish(data)
    } catch (e) {
        console.log(e)
    }
})
