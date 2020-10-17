import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { app } from '../app'

// DO NOT UNCOMMENT THIS WITHOUT A DEEP INVESTIGATION
// jest.mock('@kuber-ticket/micro-events')

interface Ticket {
    title: string
    price: number
    id: number
    createdAt: string
    updatedAt: string
}

declare global {
    namespace NodeJS {
        interface Global {
            signUpAndCookie(): string[]
            createTicket(title: string, price: number): Promise<Ticket | null>
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

    return [`express:sess=${base64}`]
}

global.createTicket = async (title, price) => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signUpAndCookie())
        .send({ title, price })
    return response.body
}
