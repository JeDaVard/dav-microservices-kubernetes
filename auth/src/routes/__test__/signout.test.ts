import request from 'supertest'
import { app } from '../../app'

it('returns 200 and invalidate the cookie after successful sign out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'a@a.com',
            password: 'aaaaaa',
        })
        .expect(201)
    const response = await request(app).post('/api/users/signout').expect(200)
    console.log(response.get('Set-Cookie')[0])
    expect(response.get('Set-Cookie')[0]).toEqual(
        'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    )
})
