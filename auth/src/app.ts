import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { json } from 'body-parser'
import { errorHandler, NotFoundError } from '@kuber-ticket/micro-auth'

import { signInRouter, signUpRouter, signOutRouter, currentUserRouter } from './routes'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    }),
)

app.use('/api/users', signInRouter)
app.use('/api/users', signUpRouter)
app.use('/api/users', signOutRouter)
app.use('/api/users', currentUserRouter)

app.get('/api/users/ping', (req, res) => {
    res.status(200).send('Pong')
})

app.use('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
