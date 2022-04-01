import BusinessAccountModel from "../models/businessaccount";
import UserModel from "../models/user";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';


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
        });

        return {
            username: newbusinessaccount.username,
            accounts: newbusinessaccount.accounts,
            creation_date: newbusinessaccount.date
        }
    }

    public async createUser(username: string, email: string, password: string){
        const businessaccountRecord = await BusinessAccountModel.findOne( { username });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        const userRecord =  await UserModel.findOne( { email });

        if(businessaccountRecord.accounts.includes(userRecord?._id)){
            throw new Error("User yet exists in business account");
        }

        if(userRecord){

            businessaccountRecord.accounts.push(userRecord._id);
            businessaccountRecord.save();

            return {
                username: businessaccountRecord.username,
                accounts: businessaccountRecord.accounts,
            }

        }else{

            const salt = randomBytes(32);
            const pwdHash = await bcrypt.hash(password.toString(), Number(salt));

            const newUser = await UserModel.create({
                email,
                password: pwdHash,
                salt: salt.toString('hex'),
                role: 'collaboratore',
            });

            businessaccountRecord.accounts.push(newUser._id);
            businessaccountRecord.save();

            return {
                username: businessaccountRecord.username,
                accounts: businessaccountRecord.accounts,
            }
        }
        
    }

    public async deleteUser(businessaccount: string, email: string){
        const businessaccountRecord = await BusinessAccountModel.findOne( { businessaccount });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        const userRecord =  await UserModel.findOne( { email });

        if(!userRecord){
            throw new Error("User not exists!");
        }

        const index = businessaccountRecord.accounts.indexOf(userRecord._id);
        if(index !== -1){
            businessaccountRecord.accounts.splice(index, 1);
            businessaccountRecord.save();
        }
        

        await UserModel.deleteOne({ email });

        return {
            username: businessaccountRecord.username,
            accounts: businessaccountRecord.accounts,
        }

    }

    public async updateUser(businessaccount: string, email: string, password: string){
        const businessaccountRecord = await BusinessAccountModel.findOne( { businessaccount });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        const userRecord =  await UserModel.findOne( { email });

        if(!userRecord){
            throw new Error("User not exists!");
        }

        if(businessaccountRecord.accounts.includes(userRecord?._id)){

            const salt = randomBytes(32);
            const newPwdHash = await bcrypt.hash(password.toString(), Number(salt));

            userRecord.password = newPwdHash;
            userRecord.save();

        }else{
            throw new Error("User not attached to Business account");
        }
 

        return {
            username: businessaccountRecord.username,
            accounts: businessaccountRecord.accounts,
        }

    }

    public async getUsers(username: string){

        const businessaccountRecord = await BusinessAccountModel.findOne( { username });

        if(!businessaccountRecord){
            throw new Error("Business account not exists");
        }

        const matched_users = await UserModel.find().where('_id').in(businessaccountRecord.accounts).exec();
        
        const users = matched_users.map(a => a.email);

        return {
            users,
        }
    }
}