import request from 'supertest'
import { app } from '../../app'

it('returns 200 and set cookie after successful sign in', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(201)
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})

it('returns 400 if missing email or password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: '',
            password: 'aaaaaa',
        })
        .expect(400)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'a@a.com',
            password: '',
        })
        .expect(400)
})

it('returns 400 when sign in without sign up', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(400)
})
