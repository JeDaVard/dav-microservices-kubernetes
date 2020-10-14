import express, { Request, Response } from 'express'
import { requireAuth } from '@kuber-ticket/micro-auth'

const router = express.Router()

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    res.status(200).send()
})

export { router }
