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

    public async createUser(businessaccount: string, new_user: string, new_pwd: string){
        const businessaccountRecord = await BusinessAccountModel.findOne( { businessaccount });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        const userRecord =  await UserModel.findOne( { new_user });

        if(userRecord){
            
            businessaccountRecord.accounts.push(userRecord._id);
            businessaccountRecord.save();
            return {
                username: businessaccountRecord.username,
                accounts: businessaccountRecord.accounts,
            }
        }else{
            
            const authServiceInstance = new AuthService();
            const { email, applied_role } = await authServiceInstance.create(new_user,new_pwd,'collaboratore');

            console.log(email,applied_role);

            return {
                username: businessaccountRecord.username,
                accounts: businessaccountRecord.accounts,
            }

        }

    }
}