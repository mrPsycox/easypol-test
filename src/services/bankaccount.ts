import bankAccountModel from "../models/bankaccount";

export default class BankAccountService {
    constructor(){}


    public async create(name: String, owner: String): Promise<any> {
        try{

            const checkBankRecord = await bankAccountModel.findOne({ name });
            if(checkBankRecord){
                throw new Error("Bank Account yet exists");
            }

            const bankAccountRecord = await bankAccountModel.create({
                name,
                owner
             });
             console.log("creato daje")

             return {
                name: bankAccountRecord.name,
                created_at: bankAccountRecord.date,
            }
        }catch(err:any){
            throw new Error(err.message);
        }


    }
}