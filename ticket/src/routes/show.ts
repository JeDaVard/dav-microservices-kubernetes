import express, { Request, Response } from 'express'
import Ticket from '../models/ticket'
import { NotFoundError } from '@kuber-ticket/micro-auth/build'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})
    res.status(200).send(tickets)
})

router.get('/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) throw new NotFoundError()
    res.status(200).send(ticket)
})

export { router }
