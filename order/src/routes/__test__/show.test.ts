import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it('return a list of orders owned by current user', async () => {
    const user = ''
    const response = await request(app).get('/api/orders').set('Cookie', user).send()
    expect(response.body.length > 1)
})

it('returns an order with 200 code', async () => {
    const user = ''
    const id = ''
    const response = await request(app)
        .get('/api/orders/' + id)
        .set('Cookie', user)
        .send()
    expect(response.body.id).toBeNull()
})

it('returns 404 if order doesnt exist', async () => {
    const user = ''
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .get('/api/orders' + id)
        .set('Cookie', user)
        .send()
        .expect(404)
})

it("returns 403 user doesn't own the order", async () => {
    const user = ''
    const id = new mongoose.Types.ObjectId()
    return request(app)
        .get('/api/orders' + id)
        .set('Cookie', user)
        .send()
        .expect(403)
})
