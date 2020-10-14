import { app } from '../../app'
import request from 'supertest'

it('returns 200 if the order was successfully deleted', async () => {
    const id = ''
    const user = ''
    return request(app)
        .delete('/api/orders/' + id)
        .set('Cookie', user)
        .send()
        .expect(200)
})

it('returns 401 if user is not authenticated', async () => {
    const id = ''
    const user = ''
    return request(app)
        .delete('/api/orders/' + id)
        .set('Cookie', user)
        .send()
        .expect(401)
})

it('returns 403 if user tries to delete not owned order', async () => {
    const id = ''
    const user = ''
    return request(app)
        .delete('/api/orders/' + id)
        .set('Cookie', user)
        .send()
        .expect(401)
})
