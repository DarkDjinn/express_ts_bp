import { Request, Response } from 'express';
import { get, controller, use } from './decorators';
import { checkJWT } from './middlewares/Auth';

@controller('')
export class AuthController {
	@get('/')
	@use(checkJWT)
	root(req: Request, res: Response) {
		res.send('OK');
	}
}
