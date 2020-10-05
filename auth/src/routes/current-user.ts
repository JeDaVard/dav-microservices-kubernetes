import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/currentuser', (req: Request, res: Response) => {
    res.send('Current user')
})

export { router }