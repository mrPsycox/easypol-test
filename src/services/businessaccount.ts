import BusinessAccountModel from "../models/businessaccount";
import UserModel from "../models/user";
import AuthService from "./auth";




export default class businessaccountService {
    constructor(){}

    public async register(username: string, token: string, email: string){
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

    public async createUser(businessaccount: string, email: string, password: string){
        const businessaccountRecord = await BusinessAccountModel.findOne( { businessaccount });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        console.log(email);
        const userRecord =  await UserModel.findOne( { email });

        console.log(userRecord);

        //CONTINUARE QUI


        return {
                username: businessaccountRecord.username,
                accounts: businessaccountRecord.accounts,
            }

        
    }
}