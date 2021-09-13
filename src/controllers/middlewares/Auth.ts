import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { RequestWithUser } from '../../interfaces';

export const checkJWT = (req: RequestWithUser, res: Response, next: NextFunction): void => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		res.status(401).send();
		return;
	}

	jwt.verify(token, config.appSecert, (err: any, user: any) => {
		if (err) return res.status(403).send();
		req.user = user;
		next();
	});
};
