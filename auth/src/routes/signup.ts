import express, { Response, Request } from 'express';

const router = express.Router();

router.post('/signup', (req: Request, res: Response) => {
    res.send('Sign Up')
})

export { router }