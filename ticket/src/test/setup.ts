import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
    namespace NodeJS {
        interface Global {
            signUpAndCookie(email: string, password: string): Promise<string[]>
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

global.signUpAndCookie = async (email, password) => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201)
    return response.get('Set-Cookie')
}
