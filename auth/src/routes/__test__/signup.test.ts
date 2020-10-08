import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful sign up', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(201)
})

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'invalidEmail',
            password: 'aaaaaa',
        })
        .expect(400)
})

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'a',
        })
        .expect(400)
})

it('returns a 400 when missing email or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'aaaaaa',
        })
        .expect(400)
})

it('returns a 400 when use existing email to sign up', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(400)
})
