import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { Ticket, TicketDoc } from '../models/ticket'
import { Order, OrderDoc } from '../models/order'
import { OrderStatus } from '@kuber-ticket/micro-events'

// DO NOT UNCOMMENT THIS WITHOUT A DEEP INVESTIGATION
// jest.mock('@kuber-ticket/micro-events')

declare global {
    namespace NodeJS {
        interface Global {
            signUpAndCookie(): { id: string; cookies: string[] }
            createTicket(): Promise<TicketDoc>
            createOrder(ticket: TicketDoc, userId: string): Promise<OrderDoc>
        }
    }
}

let mongo: MongoMemoryServer
beforeAll(async () => {
    process.env.JWT_SECRET = 'some-test-secret'
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signUpAndCookie = () => {
    const payload = {
        id: new mongoose.Types.ObjectId(),
        email: 'text@example.com',
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET!)

    const session = { jwt: token }

    const sessionJson = JSON.stringify(session)

    const base64 = Buffer.from(sessionJson).toString('base64')

    const cookies = [`express:sess=${base64}`]

    return { id: payload.id.toHexString(), cookies }
}

global.createTicket = async () => {
    const ticket = Ticket.build({ title: 'some', price: 20 })
    await ticket.save()
    return ticket
}

global.createOrder = async (ticket: TicketDoc, userId: string) => {
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + 60)
    const order = Order.build({ expiresAt, ticket, userId, status: OrderStatus.Created })
    await order.save()
    return order
}
