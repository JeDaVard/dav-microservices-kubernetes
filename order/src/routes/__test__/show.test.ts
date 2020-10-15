import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it('return a list of orders owned by current user', async () => {
    const ticket1 = await global.createTicket()
    const ticket2 = await global.createTicket()
    const ticket3 = await global.createTicket()

    const user1 = global.signUpAndCookie().cookies
    const user2 = global.signUpAndCookie().cookies

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1._id })
        .expect(201)
    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2._id })
        .expect(201)
    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3._id })
        .expect(201)

    const response = await request(app).get('/api/orders').set('Cookie', user2).send()

    expect(response.body.length).toEqual(2)
})

it('returns an order with 200 code', async () => {
    const ticket = await global.createTicket()
    const user = global.signUpAndCookie().cookies

    const orderResponse = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket._id })

    const response = await request(app)
        .get('/api/orders/' + orderResponse.body.id)
        .set('Cookie', user)
        .send()

    expect(response.body.id).not.toBeNull()
    expect(response.body.ticket.id).not.toBeNull()
})

it('returns 404 if order doesnt exist', async () => {
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .get('/api/orders' + id)
        .set('Cookie', global.signUpAndCookie().cookies)
        .send()
        .expect(404)
})

it("returns 401 user doesn't own the order", async () => {
    const ticket = await global.createTicket()
    const user1 = global.signUpAndCookie().cookies
    const user2 = global.signUpAndCookie().cookies

    const orderResponse = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket._id })

    return request(app)
        .get('/api/orders/' + orderResponse.body.id)
        .set('Cookie', user2)
        .send()
        .expect(401)
})

it("returns 404 if user tries to get an order which doesn't exist", async () => {
    const id = new mongoose.Types.ObjectId()

    return request(app)
        .get('/api/orders/' + id)
        .set('Cookie', global.signUpAndCookie().cookies)
        .send()
        .expect(404)
})
