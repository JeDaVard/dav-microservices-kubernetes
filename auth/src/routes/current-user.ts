import express, { Response, Request } from 'express'

import { currentUser } from '../middlewares/current-user'
import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.get('/currentuser', currentUser, async (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.user || null })
})

export { router }
