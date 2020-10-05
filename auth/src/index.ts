import express from 'express'
import { json } from 'body-parser'
import { signInRouter, signUpRouter, signOutRouter, currentUserRouter } from './routes'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(json())

const port = 3000

app.use('/api/users', signInRouter)
app.use('/api/users', signUpRouter)
app.use('/api/users', signOutRouter)
app.use('/api/users', currentUserRouter)

app.use(errorHandler)

app.get('/api/users/ping', (req, res) => {
    res.status(200).send('Pong')
})

app.use('*', (req, res) => {
    res.status(404).send('Not found!')
})

app.listen(port, () => {
    console.log('Auth service is up on ' + port)
})
