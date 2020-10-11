import express, { Response, Request } from 'express'
import { currentUser } from '@kuber-ticket/micro-auth'

const router = express.Router()

router.get('/currentuser', currentUser, async (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.user || null })
})

export { router }
