import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    private stan;
    abstract subject: T['subject'];
    abstract onMessage(parsedData: T['data'], msg: Message): void;
    abstract queueGroupName: string;
    constructor(stan: Stan);
    protected ackWait: number;
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
export {};
