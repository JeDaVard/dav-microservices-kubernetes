import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    res.status(200).send({})
})

router.get('/:id', async (req: Request, res: Response) => {
    res.status(200).send({})
})

export { router }
