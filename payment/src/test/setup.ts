import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// DO NOT UNCOMMENT THIS WITHOUT A DEEP INVESTIGATION
// jest.mock('@kuber-ticket/micro-events')

declare global {
    namespace NodeJS {
        interface Global {
            signUpAndCookie(): { id: string; cookies: string[] }
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
    // Define a token payload for a user
    const payload = {
        id: new mongoose.Types.ObjectId(),
        email: 'text@example.com',
    }
    // Sign a token
    const token = jwt.sign(payload, process.env.JWT_SECRET!)
    // Create a session object
    const session = { jwt: token }
    const sessionJson = JSON.stringify(session)
    // Convert to base64 format
    const base64 = Buffer.from(sessionJson).toString('base64')
    // Imitate default expressJS session-cookies appearance
    const cookies = [`express:sess=${base64}`]

    return { id: payload.id.toHexString(), cookies }
}
