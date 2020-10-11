import { app } from '../../app'
import request from 'supertest'

it('has a route handler listening on /api/tickets for POST requests', async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
    return request(app).post('/api/tickets').send({}).expect(401)
})

it('returns a status other than 401 if the user is authenticated', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signUpAndCookie()).send({
        title: 'title',
        price: 10,
    })
    expect(response.status).not.toEqual(401)
})

it('returns an error if invalid title or price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signUpAndCookie())
        .send({ title: 'Some title', price: -10 })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signUpAndCookie())
        .send({ title: '', price: 10 })
        .expect(400)
})

it('creates a ticket with valid params', async () => {
    const title = 'Some title',
        price = 10
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signUpAndCookie())
        .send({ title, price })

    expect(response.body.title).toEqual(title)
})
