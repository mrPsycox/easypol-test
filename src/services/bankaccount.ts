import { FilterQuery } from 'mongoose';
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
            return x.totaloutgo;
        }
    }
    private getCreationDate(obj:Object){
        for(let x of Object.values(obj)){
            return x.date;
        }
    }

    private async getAggregatePublic(obj:Object){
        let balance_aggr = 0;
        let total_income_aggr = 0;
        let total_outgo_aggr = 0;
        for(let pub of Object.values(obj)){
 
            balance_aggr += pub.balance;
            total_income_aggr += pub.totalincome;
            total_outgo_aggr += pub.totaloutgo;;

            const aggregate_response = this.listResponseObject("aggregate",balance_aggr,total_income_aggr,total_outgo_aggr)
            
            return aggregate_response;
        }
    }

    private async getAggregatePrivate(obj:Object){
        let balance_aggr = 0;
        let total_income_aggr = 0;
        let total_outgo_aggr = 0;

        for(let pvt of Object.values(obj)){
            balance_aggr += pvt.balance;
            total_income_aggr += pvt.totalincome;
            total_outgo_aggr += pvt.totaloutgo;

            const aggregate_response = this.listResponseObject("aggregate",balance_aggr,total_income_aggr,total_outgo_aggr)
            return aggregate_response;
            }
        }

    private async getBankPublic(obj: Object){
            const name_pub = await this.getNamefromAggregate(obj);

            const creationdate_pub = await this.getCreationDate(obj);
    
            const balance_pub = await this.getBalancefromAggregate(obj);
    
            const totalincome_pub = await this.getTotalIncomeAggregate(obj)
    
            const totaloutgo_pub = await this.getTotalOutgoAggregate(obj);
    
            const pub_response = this.listResponseObject(name_pub, balance_pub, totalincome_pub, totaloutgo_pub, creationdate_pub );

            return pub_response;
    }

    private async getBankPrivate(obj: Object){
        const name_pvt= await this.getNamefromAggregate(obj);

        const creationdate_pvt = await this.getCreationDate(obj);

        const balance_pvt = await this.getBalancefromAggregate(obj);

        const totalincome_pvt = await this.getTotalIncomeAggregate(obj)

        const totaloutgo_pvt = await this.getTotalOutgoAggregate(obj);

        const pvt_response = this.listResponseObject(name_pvt, balance_pvt, totalincome_pvt, totaloutgo_pvt, creationdate_pvt );

        return pvt_response;
}

    private listResponseObject(name: String,balance: Number,total_income: Number, total_outgo: Number,created_at?: Date){
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
                
                let size = Object.keys(bankaccountsInstance).length
                
                if(size > 1){


                    const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                    const created_at_obj_pub = await BankAccountModel.find({ owner: company, type: 'public' });

                    const pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                    const created_at_obj_pvt = await BankAccountModel.find({ owner: company, type: 'private' });

                    const created_at_pub = await this.getCreationDate(created_at_obj_pub);
                    const pub_response = await this.getBankPublic(pub);
                                        
                    pub_response.bankaccount_creation = created_at_pub;
                    
                    const pvt_response = await this.getBankPrivate(pvt);
                    const created_at_pvt = await this.getCreationDate(created_at_obj_pvt);

                    pvt_response.bankaccount_creation = created_at_pvt;

                    const aggregate_response_pub = await this.getAggregatePublic(pub);
                    const aggregate_response_pvt = await this.getAggregatePrivate(pvt);

                    const aggr_pub_balance: number = aggregate_response_pub?.balance as number;
                    const aggr_pvt_balance: number = aggregate_response_pvt?.balance as number;

                    const balance_aggr = aggr_pub_balance + aggr_pvt_balance;

                    const aggr_pub_income: number = aggregate_response_pub?.total_income as number;
                    const aggr_pvt_income: number = aggregate_response_pvt?.total_income as number;

                    const income_aggr = aggr_pub_income + aggr_pvt_income;

                    const aggr_pub_outgo: number = aggregate_response_pub?.total_outgo as number;
                    const aggr_pvt_outgo: number = aggregate_response_pvt?.total_outgo as number;

                    const outgo_aggr = aggr_pub_outgo + aggr_pvt_outgo;

                    const aggregate_response = this.listResponseObject("aggregate",balance_aggr,income_aggr,outgo_aggr);


                    return {
                        aggregate_response: aggregate_response,
                        pvt_response: pvt_response,
                        pub_response: pub_response,
                    }

                }else if(size == 1){

                    const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                    const pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});

                    if(pub){

                        const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                        const created_at_obj = await BankAccountModel.find({ owner: company, type: 'public' });

                        const created_at = await this.getCreationDate(created_at_obj);
                        const pub_response = await this.getBankPublic(pub);
        
                        pub_response.bankaccount_creation = created_at;
                        
                        return {
                            pub_response: pub_response,
                        }

                    }else if(pvt){

                        const pvt = await BankAccountModel.aggregate().match({type:'private' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                        const created_at_obj = await BankAccountModel.find({ owner: company, type: 'private' });

                        const pvt_response = await this.getBankPrivate(pvt);
                        const created_at = await this.getCreationDate(created_at_obj);
                        pvt_response.bankaccount_creation = created_at;

                        return {
                            pvt_response: pvt_response,
                        }
                    }
                }

            }else{ 

                const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id':'$name', 'totalincome':{ '$sum':'$transactions.income'},'totaloutgo':{ '$sum':'$transactions.outgo'},'balance': { $last: '$transactions.balance'}});
                const created_at_obj_pub = await BankAccountModel.find({ owner: company, type: 'public' });

                if(!pub){
                    throw new Error("No Bank Account in Database!");
                }

                const created_at = await this.getCreationDate(created_at_obj_pub);
                const aggregate_response = await this.getAggregatePublic(pub);
                const pub_response = await this.getBankPublic(pub);

                pub_response.bankaccount_creation = created_at;
                

                return {
                    aggregate_response: aggregate_response,
                    pub_response: pub_response,
                }

            }

        }catch(err:any){
            throw new Error(err.message);
        }
    }

    public async listTransactionsMonthbyMonth(isAdmin: boolean, company: String): Promise<any> {
        try {

            if(isAdmin){ 
                
                const bankaccountsInstance = await BankAccountModel.find({ owner: company });
                if(!bankaccountsInstance){
                    throw new Error("No Bank Account in Database!");
                }                
                
                let size = Object.keys(bankaccountsInstance).length

                if(size > 1)
                {
                    const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'desc'}).group({ '_id': { month: {$month: '$date'}, count: {$sum: 1}}});
                    console.log(pub);   

                }else if(size == 1){

                    const pub = await BankAccountModel.aggregate().match({type:'public' , owner: company}).unwind('transactions').sort({'date':'asc'}).group({ '_id': { month: {$month: '$date'}}, "total": {$sum:"$transactions.income"}});
                    console.log(pub);
                }

            }else{
            }

        }catch(err){

        }
    }

    public async listTransactionsonInterval(isAdmin: boolean, company: String): Promise<any> {
        
    }
}

