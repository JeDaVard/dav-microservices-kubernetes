import express, { Response, Request } from 'express';

const router = express.Router();

router.post('/signout', (req: Request, res: Response) => {
    res.send('Sign out')
})

export { router }