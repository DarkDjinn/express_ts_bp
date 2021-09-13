import squel from 'squel';
import { DBQuery } from '../../models/mysql';
import { RegUser, LoginUser } from '../../interfaces';
import bcrypt from 'bcryptjs';

squel.cls.DefaultQueryBuilderOptions.replaceSingleQuotes = true;

export const register = async (user: RegUser): Promise<{ success: boolean; result: any }> => {
	try {
		const q = squel
			.insert()
			.into('users')
			.set('username', user.username)
			.set('email', user.email)
			.set('password', user.password)
			.toString();
		return { success: true, result: await DBQuery(q) };
	} catch (err: any) {
		return { success: false, result: err };
	}
};

export const login = async (
	login: LoginUser
): Promise<{ loginSuccess: boolean; result: string | undefined }> => {
	try {
		const q = squel.select().from('users').where('email = ?', login.email).toString();
		const user = await DBQuery(q);
		if (user.result && user.result.length > 0) {
			return {
				loginSuccess: bcrypt.compareSync(login.password, user.result[0].password),
				result: user.result[0].id,
			};
		}
		return {
			loginSuccess: false,
			result: 'invalid login',
		};
	} catch (err: any) {
		return {
			loginSuccess: false,
			result: err.message,
		};
	}
};

export const getByUserID = async (id: number): Promise<{ status: boolean; result: any }> => {
	try {
		const q = squel.select().from('users').where('id = ?', id).toString();
		return await DBQuery(q);
	} catch (err: any) {
		return err;
	}
};
