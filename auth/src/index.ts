import express from 'express'
// require('express-async-errors')
import { json } from 'body-parser'
import { signInRouter, signUpRouter, signOutRouter, currentUserRouter } from './routes'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()

app.use(json())

const port = 3000

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

app.listen(port, () => {
    console.log('Auth service is up on ' + port)
})
