import { connect } from 'node-nats-streaming'

const stan = connect('ticket', 'abc', {
    url: 'http://localhost:4222',
})

stan.on('connect', () => {
    console.log('Publisher connected!')

    const data = JSON.stringify({
        id: 1,
        title: 'Some title',
        price: 10,
    })

    stan.publish('ticket:created', data, () => {
        console.log('published')
    })
})
