import express, { Response, Request } from 'express'

const router = express.Router()

router.post('/signout', async (req: Request, res: Response) => {
    req.session = null
    res.status(200).send({ currentUser: null })
})

export { router }
