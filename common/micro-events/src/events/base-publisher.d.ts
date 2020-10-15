import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Publisher<T extends Event> {
    private stan;
    abstract subject: T['subject'];
    constructor(stan: Stan);
    publish(data: T['data']): Promise<void>;
}
export {};
