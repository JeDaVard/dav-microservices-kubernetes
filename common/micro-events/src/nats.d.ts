import { Stan } from 'node-nats-streaming';
declare class Nats {
    private _client?;
    get client(): Stan;
    connect(clusterID: string, clientID: string, url: string, callback?: () => void): Promise<unknown>;
}
declare const nats: Nats;
export { nats };
