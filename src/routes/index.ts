import user from './user';
import express from 'express';
import business_account from './business_account';

const app = express();

user(app);
business_account(app)

export default app;