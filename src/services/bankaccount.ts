import BankAccountModel from "../models/bankaccount";

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

    private getBalancefromAggregate(obj:Object){
        for(let x of Object.values(obj)){
            return x.transactions.balance;
        }
    }
    private getTotalIncomeAggregate(obj: Object){
        for(let x of Object.values(obj)){
            return x.totalincome;
        }
    }

    private getTotalOutgoAggregate(obj: Object){
        for(let x of Object.values(obj)){
            return x.totalincome;
        }
    }

    private listResponseObject(name: String[],created_at: Date[],balance: Number,total_income: Number, total_outgo: Number){
        return {
            name: name,
            bankaccount_creation: created_at,
            balance: balance,
            total_income: total_income,
            total_outgo: total_outgo
        }
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
                const bankAccountCreations = this.getCreationsfromFind(bankaccountsInstance) as Date[];

                let retAggregate = undefined;
                let retSingle = undefined;
                
                if(bankAccountNames.length > 1 && bankAccountCreations.length > 1){

                    const lastbalance_pvt = await (await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions')).slice(-1);
                    const lastbalance_pub = await (await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions')).slice(-1);

                    const balance_pvt = this.getBalancefromAggregate(lastbalance_pvt);
                    const balance_pub = this.getBalancefromAggregate(lastbalance_pub);

                    const balance_aggregate = balance_pvt+balance_pub;


                    const incomepvtobj = await BankAccountModel.aggregate().match({type:'private', owner: company}).unwind('transactions').group({ '_id':'_id', 'totalincome':{ '$sum':'$transactions.income'}});
                    const outgopvtobj =  await BankAccountModel.aggregate().match({ type: 'public', owner: company}).unwind('transactions').group({ '_id':'_id', 'totaloutgo':{ '$sum':'$transactions.outgo'}});

                    const totalincome_pvt = this.getTotalIncomeAggregate(incomepvtobj);
                    const totaloutgo_pvt = this.getTotalOutgoAggregate(outgopvtobj);

                    retAggregate = this.listResponseObject(bankAccountNames,bankAccountCreations,balance_aggregate,totalincome_pvt,totaloutgo_pvt);

                }else if(bankAccountNames.length == 1 && bankAccountCreations.length == 1){

                    const lastbalance = await (await BankAccountModel.aggregate().match({ owner: company}).unwind('transactions')).slice(-1);
                    const balance = this.getBalancefromAggregate(lastbalance);
                    const incomeobj = await BankAccountModel.aggregate().match({type:'private', owner: company}).unwind('transactions').group({ '_id':'_id', 'totalincome':{ '$sum':'$transactions.income'}});
                    const outgoobj =  await BankAccountModel.aggregate().match({ type: 'public', owner: company}).unwind('transactions').group({ '_id':'_id', 'totaloutgo':{ '$sum':'$transactions.outgo'}});

                    const totalincome = this.getTotalIncomeAggregate(incomeobj);
                    const totaloutgo = this.getTotalOutgoAggregate(outgoobj);

                    
                    retSingle = this.listResponseObject(bankAccountNames,bankAccountCreations,balance,totalincome,totaloutgo);
                }

                console.log(retAggregate,retSingle)
                return [retAggregate,retSingle];

            }else{ //utenza di tipo collaboratore

            }

        }catch(err:any){
            throw new Error(err.message);
        }
    }
}