import { Application, Request, Response, } from "express";
import bankaccount from "../models/bankaccount";
import bankAccountService from '../services/bankaccount'

export default (app:Application) => {

    app.post('/bankaccount/create', async(req: Request, res: Response) => {
        try{
        
        const bankaccountname = req.body.name;
        const company = req.body.company;
        
        const bankAccountServiceInstance = new bankAccountService();
        const { name, owner } = await bankAccountServiceInstance.create(bankaccountname,company);
            
        return res.json({ name, owner }).status(200).end();


        }catch(err) {
            console.log(err)
            return res.status(500).json({ message: "Something wrong!" })
        }
    });
}