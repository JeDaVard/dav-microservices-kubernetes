import { Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
    subject: Subjects
    data: any
}

export abstract class BasePublisher<T extends Event> {
    abstract subject: T['subject']
    constructor(private stan: Stan) {}
    publish(data: T['data']) {
        this.stan.publish(this.subject, data, () => {
            console.log('Event published ::')
        })
    }
}
