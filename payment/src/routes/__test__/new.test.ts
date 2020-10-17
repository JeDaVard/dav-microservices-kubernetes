import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Types } from 'mongoose'
import { OrderStatus } from '@kuber-ticket/micro-events'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('requires the user to be authenticated', async () => {
    return request(app).post('/api/payments').send({}).expect(401)
})

it('throws validation error if orderId or payment token is not provided', async () => {
    const { cookies } = global.signUpAndCookie()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookies)
        .send({ token: 'some token', orderId: '' })
        .expect(400)

    return request(app)
        .post('/api/payments')
        .set('Cookie', cookies)
        .send({ token: 'some token', orderId: '' })
        .expect(400)
})

it('throws not found error if order is not found', async () => {
    const { cookies } = global.signUpAndCookie()
    return request(app)
        .post('/api/payments')
        .set('Cookie', cookies)
        .send({ token: 'some token', orderId: new Types.ObjectId() })
        .expect(404)
})

it('must successfully process the payment', async () => {
    const user1 = global.signUpAndCookie()
    const user2 = global.signUpAndCookie()
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId: user1.id,
        version: 0,
        price: 1,
        status: OrderStatus.Created,
    })
    await order.save()
    return request(app)
        .post('/api/payments')
        .set('Cookie', user2.cookies)
        .send({ token: 'some token', orderId: order.id })
        .expect(401)
})

it('must successfully process the payment', async () => {
    const { cookies, id } = global.signUpAndCookie()
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId: id,
        version: 0,
        price: 1,
        status: OrderStatus.Created,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookies)
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.currency).toEqual('usd')
})
