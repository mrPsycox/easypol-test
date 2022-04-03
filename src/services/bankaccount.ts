import BankAccountModel from "../models/bankaccount";

export default class BankAccountService {
    constructor(){}

    private getBalancefromAggregate(obj:Object){
        for(let x of Object.values(obj)){
            return x.balance;
        }
    }
    private getNamefromAggregate(obj:Object){
        for(let x of Object.values(obj)){
            return x._id;
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
    private getCreationDate(obj:Object){
        for(let x of Object.values(obj)){
            return x.date;
        }
    }

    private listResponseObject(name: String,created_at: Date,balance: Number,total_income: Number, total_outgo: Number){
        return {
            name: name,
            bankaccount_creation: created_at,
            balance: balance,
            total_income: total_income,
            total_outgo: total_outgo
        }
    }


    private async getPrivateBalance(company: String){
        const lastbalance_pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id': '$name', balance: { $last: '$transactions.balance'} });

        const balance_pvt = this.getBalancefromAggregate(lastbalance_pvt);

        return balance_pvt;
    }

    private async getPublicBalance(company: String){
        const lastbalance_pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', balance: { $last: '$transactions.balance'} });

        const balance_pub = this.getBalancefromAggregate(lastbalance_pub);

        return balance_pub;

    }

    private async getNamePublic(company: String){
        const lastbalance_pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', balance: { $last: '$transactions.balance'} });

        const name_pub = this.getNamefromAggregate(lastbalance_pub);

        return name_pub;

    }
    private async getNamePrivate(company: String){
        const lastbalance_pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', balance: { $last: '$transactions.balance'} });

        const name_pvt = this.getNamefromAggregate(lastbalance_pvt);

        return name_pvt;

    }

    private async getTotalIncomePrivate(company: String){
        const incomepvtobj = await BankAccountModel.aggregate().match({type:'private', owner: company}).unwind('transactions').group({ '_id':'_id', 'totalincome':{ '$sum':'$transactions.income'}});

        const totalincome_pvt = this.getTotalIncomeAggregate(incomepvtobj);

        return totalincome_pvt;
    }

    private async getTotalIncomePublic(company: String){
        const incomepubobj = await BankAccountModel.aggregate().match({type:'public', owner: company}).unwind('transactions').group({ '_id':'_id', 'totalincome':{ '$sum':'$transactions.income'}});

        const totalincome_pub = this.getTotalIncomeAggregate(incomepubobj);

        return totalincome_pub;
    }

    private async getTotalOutgoPrivate(company: String){
        const outgopvtobj =  await BankAccountModel.aggregate().match({ type: 'private', owner: company}).unwind('transactions').group({ '_id':'_id', 'totaloutgo':{ '$sum':'$transactions.outgo'}});

        const totaloutgo_pvt = this.getTotalOutgoAggregate(outgopvtobj);

        return totaloutgo_pvt;
    }

    private async getTotalOutgoPublic(company: String){
        const outgopubobj =  await BankAccountModel.aggregate().match({ type: 'public', owner: company}).unwind('transactions').group({ '_id':'_id', 'totaloutgo':{ '$sum':'$transactions.outgo'}});

        const totaloutgo_pub = this.getTotalOutgoAggregate(outgopubobj);

        return totaloutgo_pub;
    }

    private async getCreationDatePublic(company: String){
        const creationdate_pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$date' });

        const creatdate = this.getCreationDate(creationdate_pub);

        return creatdate;
    }

    private async getCreationDatePrivate(company: String){
        const creationdate_pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$date' });

        const creatdate = this.getCreationDate(creationdate_pvt);

        return creatdate;
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
                
                let size = Object.keys(bankaccountsInstance).length
                

                let retAggregate = undefined;
                let retSingle = undefined;
                
                if(size > 1){

                    const name_pvt = await this.getNamePrivate(company);
                    const name_pub = await this.getNamePublic(company)

                    const creationdate_pub = await this.getCreationDatePublic(company);
                    const creationdate_pvt = await this.getCreationDatePrivate(company);

                    const balance_pvt = await this.getPrivateBalance(company);
                    const balance_pub = await this.getPublicBalance(company);
                    
                    const balance_aggr = balance_pub + balance_pvt

                    const totalincome_pvt = await this.getTotalIncomePrivate(company);
                    const totaloutgo_pvt = await this.getTotalOutgoPrivate(company);

                    const totalincome_pub = await this.getTotalIncomePublic(company);
                    const totaloutgo_pub = await this.getTotalOutgoPublic(company);

                    const totalincome_aggr = totalincome_pub + totalincome_pvt;
                    
                    const totaloutgo_aggr = totaloutgo_pub + totaloutgo_pvt;

                    const aggregate_response = this.listResponseObject(company+"aggregate",creationdate_pvt,balance_aggr,totalincome_aggr,totaloutgo_aggr);

                    console.log(aggregate_response);



                }else if(size == 1){

                    const lastbalance = await (await BankAccountModel.aggregate().match({ owner: company}).unwind('transactions')).slice(-1);
                    const balance = this.getBalancefromAggregate(lastbalance);
                    const incomeobj = await BankAccountModel.aggregate().match({type:'private', owner: company}).unwind('transactions').group({ '_id':'_id', 'totalincome':{ '$sum':'$transactions.income'}});
                    const outgoobj =  await BankAccountModel.aggregate().match({ type: 'public', owner: company}).unwind('transactions').group({ '_id':'_id', 'totaloutgo':{ '$sum':'$transactions.outgo'}});

                    const totalincome = this.getTotalIncomeAggregate(incomeobj);
                    const totaloutgo = this.getTotalOutgoAggregate(outgoobj);

                    
                    //retSingle = this.listResponseObject(bankAccountNames,bankAccountCreations,balance,totalincome,totaloutgo);
                }

                return true;

            }else{ //utenza di tipo collaboratore

            }

        }catch(err:any){
            throw new Error(err.message);
        }
    }
}