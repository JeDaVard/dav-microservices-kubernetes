import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { json } from 'body-parser'
import { errorHandler, NotFoundError, currentUser } from '@kuber-ticket/micro-auth'

import {
    createTicketRouter,
    showTicketRouter,
    updateTicketRouter,
    deleteTicketRouter,
} from './routes'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    }),
)
app.use(currentUser)

app.use('/api/orders', createTicketRouter)
app.use('/api/orders', showTicketRouter)
app.use('/api/orders', updateTicketRouter)
app.use('/api/orders', deleteTicketRouter)

app.get('/api/users/ping', (req, res) => {
    res.status(200).send('Pong')
})

app.use('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
