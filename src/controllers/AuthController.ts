import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { register, login } from '../db/mysql';
import { post, controller, bodyValidator } from './decorators';
import { RegUser, LoginUser, RequestWithBody } from '../interfaces';
import { loginSchema, registrationSchema } from '../validationSchemas';

@controller('/auth')
export class AuthController {
	@post('/register')
	@bodyValidator('username', 'email', 'password', 'repeat_password')
	async registerUser(req: RequestWithBody, res: Response): Promise<void> {
		try {
			const body: RegUser = await registrationSchema.validateAsync(req.body);
			if (body) {
				body.password = bcrypt.hashSync(body.password, 8);
				const reg = await register(body);
				if (reg.success) {
					const token = jwt.sign({ id: reg.result.insertId }, config.appSecert, {
						expiresIn: 86400,
					});
					res.status(200).send({ auth: true, token });
				} else {
					res.status(403).send({ auth: false });
				}
			} else res.status(422).send('All fields are required');
		} catch (err: any) {
			res.send(err.message);
		}
	}

	@post('/login')
	@bodyValidator('email', 'password')
	async loginUser(req: RequestWithBody, res: Response): Promise<void> {
		try {
			const body: LoginUser = await loginSchema.validateAsync(req.body);
			if (body) {
				const isLoggedIn = await login(body);
				if (isLoggedIn.loginSuccess) {
					const token = jwt.sign({ id: isLoggedIn.result }, config.appSecert, {
						expiresIn: 86400,
					});
					res.status(200).send({ auth: true, token });
				} else {
					res.status(403).send({ auth: false });
				}
			} else res.status(422).send('All fields are required');
		} catch (err: any) {
			res.status(500).send(err.message);
		}
	}
}
