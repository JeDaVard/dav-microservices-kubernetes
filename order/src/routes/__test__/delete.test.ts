import { app } from '../../app'
import request from 'supertest'
import { OrderStatus } from '@kuber-ticket/micro-events'
import mongoose from 'mongoose'

it('returns 200 if the order was successfully changed to cancelled', async () => {
    const user = global.signUpAndCookie()
    const ticket = await global.createTicket()
    const order = await global.createOrder(ticket, user.id)

    const response = await request(app)
        .delete('/api/orders/' + order.id)
        .set('Cookie', user.cookies)
        .send()
    expect(response.body.status).toEqual(OrderStatus.Cancelled)
})

it('returns 400 if user tries to delete not owned order', async () => {
    const user1 = global.signUpAndCookie()
    const ticket = await global.createTicket()
    const order = await global.createOrder(ticket, user1.id)

    const user2 = global.signUpAndCookie()

    return request(app)
        .delete('/api/orders/' + order.id)
        .set('Cookie', user2.cookies)
        .send()
        .expect(400)
})

it("returns 404 if user tries to delete an order which doesn't exist", async () => {
    const user = global.signUpAndCookie().cookies
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .delete('/api/orders/' + id)
        .set('Cookie', user)
        .send()
        .expect(404)
})
