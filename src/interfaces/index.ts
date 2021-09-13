import { Request } from 'express';

export interface AppConfig {
	IS_DEV: boolean;
	REQUEST_TIME_OUT: number;
	APP_PORT: number;
	DB_POOL_SIZE: number;
	MYSQL: MYSQL;
	AWS: AWS;
}

export interface MYSQL {
	HOST: string;
	PORT: number;
	USER: string;
	PASSWORD: string;
	DATABASE: string;
}

export interface AWS {
	SQS_QUEUE_URL: string;
	REGION: string;
	ACCESS_KEY_ID: string;
	SECRET_ACCESS_KEY: string;
	ARN: string;
}

export interface RequestWithBody extends Request {
	body: { [key: string]: string | undefined };
}

export interface RequestWithUser extends Request {
	user?: any;
}

export interface RegUser {
	username: string;
	email: string;
	password: string;
}

export interface LoginUser {
	email: string;
	password: string;
}
