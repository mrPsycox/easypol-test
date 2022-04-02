import BankAccountModel from "../models/bankaccount";
import BankAccountSchema from '../models/bankaccount';

export default class BankAccountService {
    constructor(){}


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
    public async listBankAccounts(isAdmin: boolean): Promise<any> {

        try {

            if(isAdmin){ //utenza di tipo admin
                let toReturn = {
                    bankaccounts: [] as any,
                };

                const bankAccountModel = await BankAccountModel.find();

                for( let x of Object.values(bankAccountModel)){

                    toReturn.bankaccounts.push({
                        name: x.name,
                        first_connection: x.date
                    })
                }
                
                return {
                    toReturn,
                }

            }else{ //utenza di tipo collaboratore

            }

        }catch(err:any){
            throw new Error(err.message);
        }
    }
}