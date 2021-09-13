import express from 'express';
import { AppRouter } from './AppRouter';
import { config } from './config';
import './controllers/AuthController';
import './controllers/RootController';

const app = express();

app.use(express.json());
app.use(AppRouter.getInstance());

app.listen(config.APP_PORT, () => {
	console.log(`Server is up on port ${config.APP_PORT}.`);
});
