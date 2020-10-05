import express from 'express';
import { json } from "body-parser";

const app = express();

app.use(json());

const port = 3000

app.get('/api/users/ping', (req, res) => {
    res.status(200).send('Pong')
})

app.listen(port, () => {
    console.log('Auth service is up on ' + port)
})