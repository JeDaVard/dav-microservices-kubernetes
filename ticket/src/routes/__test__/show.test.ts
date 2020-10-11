import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it("return 404 for a ticket route which doesn't exist", async () => {
    await request(app).get(`/api/tickets/${new mongoose.Types.ObjectId()}`).send().expect(404)
})

it('return the ticket if ticket is found', async () => {
    const ticket = await global.createTicket('some title', 10)
    const foundTicket = await request(app).get(`/api/tickets/${ticket!.id}`).send()
    expect(foundTicket.body.title).toEqual(ticket!.title)
    expect(foundTicket.body.price).toEqual(ticket!.price)
})

it('return a list of tickets', async () => {
    await global.createTicket('some title', 10)
    await global.createTicket('some title', 10)
    const tickets = await request(app).get(`/api/tickets`).send()
    expect(tickets.body.length).toEqual(2)
})
