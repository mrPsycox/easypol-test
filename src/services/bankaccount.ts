import BankAccountModel from "../models/bankaccount";
import BankAccountInterface from '../models/bankaccount'

export default class BankAccountService {
    constructor(){}


    private getNamesfromFind(obj: Object){
        let names = [];
        for (let x of Object.values(obj)) {
            names.push(x.name);
        }
        return names 
    }
    private getCreationsfromFind(obj: Object){
        let created_ats = [];
        for (let x of Object.values(obj)) {
            created_ats.push(x.date);
        }
        return created_ats; 
    }

    private getBalancefromAggregate(obj: Object){

    }


    public async create(name: String, owner: String, type: String): Promise<any> {
        try{

            const checkBankRecord = await BankAccountModel.findOne({ name });
            if(checkBankRecord){
                throw new Error("Bank Account yet exists");
            }

            const bankAccountRecord = await BankAccountModel.create({
                name,
                owner,
                type
             });

             return {
                name: bankAccountRecord.name,
                created_at: bankAccountRecord.date,
                type: bankAccountRecord.type,
            }
        }catch(err:any){
            throw new Error(err.message);
        }
    }
    public async listBankAccounts(isAdmin: boolean,company: String): Promise<any> {

        try {

            if(isAdmin){ 

                const bankaccountsInstance = await BankAccountModel.find({ owner: company });

                if(!bankaccountsInstance){
                    throw new Error("No Bank Account in Database!");
                }                
                
                const bankAccountNames = this.getNamesfromFind(bankaccountsInstance) as String[];
                const bankAccountCreations = this.getCreationsfromFind(bankaccountsInstance) as String[];
                
                if(bankAccountNames.length > 1 && bankAccountCreations.length > 1){

                    console.log("sono qui")
                    const company_pvt = await (await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions')).slice(-1);
                    const company_pub = await (await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions')).slice(-1);

                    console.log(company_pvt)
                    console.log(company_pub);
                    const balance_pvt = this.getBalancefromAggregate(company_pvt);
                    const balance_pub = this.getBalancefromAggregate(company_pub);
                }

                /*
                const company_pvt = await (await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions')).slice(-1);
                const company_pub = await (await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions')).slice(-1);
                */
                
                console.log("sono li")
                return {
                    stuff: true,
                }

            }else{ //utenza di tipo collaboratore

            }

        }catch(err:any){
            throw new Error(err.message);
        }
    }
}