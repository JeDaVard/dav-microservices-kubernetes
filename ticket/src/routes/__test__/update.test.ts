import { app } from '../../app'
import request from 'supertest'

it("successfully updates the ticket's title and price and returns it updated", async () => {
    const params = { title: 'some title', price: 10 }
    const cookie = global.signUpAndCookie()
    const ticket = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({ title: 'asdasdas', price: 99 })

    const response = await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', cookie)
        .send(params)
    expect(response.body.title).toEqual(params.title)
    expect(response.body.price).toEqual(params.price)
})

it('fails with 403 if user tries to update not own ticket', async () => {
    const params = { title: 'some title', price: 10 }
    const cookie = global.signUpAndCookie()
    const ticket = await global.createTicket('asf', 99)
    return request(app)
        .put(`/api/tickets/${ticket!.id}`)
        .set('Cookie', cookie)
        .send(params)
        .expect(401)
})

it('fails with 401 if a guest tries to update a ticket', async () => {
    const params = { title: 'some title', price: 10 }
    const ticket = await global.createTicket('asf', 99)
    return request(app).put(`/api/tickets/${ticket!.id}`).send(params).expect(401)
})
