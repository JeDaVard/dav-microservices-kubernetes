import { connect, Stan } from 'node-nats-streaming'

class Nats {
    private _client?: Stan
    get client() {
        if (!this._client) {
            throw new Error('You need to connect first.')
        }
        return this._client
    }
    connect(clusterID: string, clientID: string, url: string, callback?: () => void) {
        this._client = connect(clusterID, clientID, { url })

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () => {
                if (callback) callback()
                resolve()
            })
            this._client!.on('error', (err) => {
                reject(err)
            })
        })
    }
}
const nats = new Nats()
export { nats }
