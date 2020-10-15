import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@kuber-ticket/micro-events/build'

it('returns 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId()
    return request(app).post('/api/orders/').send({ ticketId: id }).expect(401)
})

it('returns 400 error if ticket is reserved', async () => {
    const ticket = Ticket.build({ title: 'some title', price: 1 })
    await ticket.save()
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + 60)
    const order = Order.build({
        expiresAt,
        ticket,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
    })
    await order.save()
    return request(app)
        .post('/api/orders/')
        .set('Cookie', global.signUpAndCookie())
        .send({ ticketId: ticket._id })
        .expect(400)
})

it('returns an error 404 if ticket doesnt exist', async () => {
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .post('/api/orders/')
        .set('Cookie', global.signUpAndCookie())
        .send({ ticketId: id })
        .expect(404)
})

it('creates an order with 201 code', async () => {
    const ticket = Ticket.build({ title: 'some title', price: 1 })
    await ticket.save()
    const response = await request(app)
        .post('/api/orders/')
        .set('Cookie', global.signUpAndCookie())
        .send({ ticketId: ticket._id })
    expect(!!response.body.ticket).not.toEqual(false)
})

it.todo('Emits an event of order created')
