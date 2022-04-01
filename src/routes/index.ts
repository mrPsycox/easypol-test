import user from './user';
import express from 'express';
import business_account from './business_account';
import bankaccount
 from './bankaccount';
const app = express();

user(app);
business_account(app)
bankaccount(app);

export default app;