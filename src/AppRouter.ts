import express from 'express';

// Export express router as Singleton
export class AppRouter {
	private static instance: express.Router;

	static getInstance(): express.Router {
		if (!this.instance) AppRouter.instance = express.Router();
		return AppRouter.instance;
	}
}
