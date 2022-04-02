import { Application, Request, Response, } from "express";
import bankaccount from "../models/bankaccount";
import AuthService from "../services/auth";
import bankAccountService from '../services/bankaccount'

export default (app:Application) => {

    app.post('/bankaccount/create', async(req: Request, res: Response) => {
        const bankaccountname = req.body.name;
        const company = req.body.company;
        const accounttype = req.body.type;
    
        try{
            
        const bankAccountServiceInstance = new bankAccountService();
        const { name, owner } = await bankAccountServiceInstance.create(bankaccountname,company,accounttype);
            
        return res.json({ name, owner }).status(200).end();


        }catch(err) {
            console.log(err)
            return res.status(500).json({ message: "Something wrong!" })
        }
    });
    
    app.get('/bankaccount/list', async(req: Request, res: Response) => {
        const token = req.body.token;

        try {

            const authServiceInstance = new AuthService();
            const { email,has_grant } = await authServiceInstance.hasGrant(token);

            if( has_grant == true){ //qua get di tutti i conti correnti

                const bankAccountServiceInstance = new bankAccountService();
                const { toReturn } = await bankAccountServiceInstance.listBankAccounts(has_grant);

                const bankaccounts = toReturn.bankaccounts;
                return res.json({ bankaccounts }).status(200).end();

            }else{ //qua get di conti correnti pubblici (contoB contoC)

            }


        }catch(err){    
            console.log(err);
            return res.status(500).json({ message: "Something wrong!"});
        }

    });
}