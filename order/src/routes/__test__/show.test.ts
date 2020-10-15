import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
    const ticket = Ticket.build({ title: 'some', price: 20 })
    await ticket.save()
    return ticket
}

it('return a list of orders owned by current user', async () => {
    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = global.signUpAndCookie()
    const user2 = global.signUpAndCookie()

    const aaa = await request(app)
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

    expect(response.body.length).toBeGreaterThan(1)
})

// it('returns an order with 200 code', async () => {
//     const user = ''
//     const id = ''
//     const response = await request(app)
//         .get('/api/orders/' + id)
//         .set('Cookie', user)
//         .send()
//     expect(response.body.id).toBeNull()
// })

it('returns 404 if order doesnt exist', async () => {
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .get('/api/orders' + id)
        .set('Cookie', global.signUpAndCookie())
        .send()
        .expect(404)
})

// it("returns 403 user doesn't own the order", async () => {
//     const user = ''
//     const id = new mongoose.Types.ObjectId()
//     return request(app)
//         .get('/api/orders' + id)
//         .set('Cookie', user)
//         .send()
//         .expect(403)
// })
