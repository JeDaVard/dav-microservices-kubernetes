import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { app } from '../app'

declare global {
    namespace NodeJS {
        interface Global {
            signUpAndCookie(): string[]
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
        id: '5cg83hiduwe8ideiwk',
        email: 'text@example.com',
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET!)

    const session = { jwt: token }

    const sessionJson = JSON.stringify(session)

    const base64 = Buffer.from(sessionJson).toString('base64')

    return [`express:sess=${base64}`]
}
