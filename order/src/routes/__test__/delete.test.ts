import { app } from '../../app'
import request from 'supertest'
import { OrderStatus } from '@kuber-ticket/micro-events'

it('returns 200 if the order was successfully changed to canceled', async () => {
    const user = global.signUpAndCookie()
    const ticket = await global.createTicket()
    const order = await global.createOrder(ticket, user.id)

    const response = await request(app)
        .delete('/api/orders/' + order.id)
        .set('Cookie', user.cookies)
        .send()
    expect(response.body.status).toEqual(OrderStatus.Canceled)
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
