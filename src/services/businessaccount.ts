import BusinessAccountModel from "../models/businessaccount";
import UserModel from "../models/user";

export default class businessaccountService {
    constructor(){}

    public async create(username: string, token: string, email: string){
        const userRecord = await UserModel.findOne({ token });

        if(!userRecord){
            throw new Error('User not logged in. Please login.');
        }
        
        const businessaccountRecord = await(BusinessAccountModel.findOne({ username }));

        if(businessaccountRecord){
            throw new Error("Business account yet existing!");
        }
        
        
        const newbusinessaccount = await BusinessAccountModel.create({
            username,
            undefined,
            email
        });

        return {
            username: newbusinessaccount.username,
            accounts: newbusinessaccount.accounts,
            created_by: newbusinessaccount.created_by
        }
    }
}