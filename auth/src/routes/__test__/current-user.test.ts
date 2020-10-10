import request from 'supertest'
import { app } from '../../app'

it("returns current user's details", async () => {
    const email = 'a@a.com'
    const cookie = await global.signUpAndCookie(email, 'aaaaaa')

    let response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200)
    expect(response.body.currentUser.email).toEqual(email)
})

it("returns current user's details", async () => {
    let response = await request(app).get('/api/users/currentuser').send().expect(200)
    expect(response.body.currentUser).toBeNull()
})
