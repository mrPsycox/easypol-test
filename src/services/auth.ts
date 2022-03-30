import bcrypt from 'bcrypt';
import UserModel from "../models/user"
import jwt, { Jwt } from 'jsonwebtoken';
import decoder from 'jwt-decode';
import { randomBytes } from 'crypto';

export default class AuthService {
    constructor(){}


    private generateJWT(user: any){
        return jwt.sign({
            data: {
                _id: user._id,
                email: user.email,
            }
        }, 'MySuP3R_z3kr3t.', { expiresIn: '6h' });
    }


    public async create(email: String, password: String, role: String): Promise<any> {
        const salt = randomBytes(32);
        const pwdHash = await bcrypt.hash(password.toString(), Number(salt));

        const userRecord = await UserModel.create({
           email,
           password: pwdHash,
           salt: salt.toString('hex'),
           role,
        });

        console.log(userRecord.role)
        return {
            email: userRecord.email,
            applied_role: userRecord.role,
        }
    }

    public async login(email: String, password: String): Promise<any> {
        
        const userRecord = await UserModel.findOne({ email });

        if(!userRecord) {
            throw new Error('User not exists');
            
        }
        
        const checkPwd = await bcrypt.compare(password.toString(), userRecord.password!.toString());

        if(!checkPwd){
            throw new Error('Incorrect password');
        }

        if(userRecord.token){
            try {
                //future check of jwt token
                const decoded = JSON.stringify(decoder(userRecord.token),null,4);
            }catch(err){
                throw new Error("Unable to decode token");
            }
        }
        
        const new_token = this.generateJWT(userRecord);
        userRecord.token = new_token;

        await userRecord.save();

        return {
            email: userRecord.email,
            token: new_token
        }
    }

    public async logout(email: string, password: string): Promise<any> {
        let isExpired = false;

        const userRecord = await UserModel.findOne({ email });

        if(!userRecord) {
            throw new Error('User not exists');
        }

        const checkPwd = await bcrypt.compare(password.toString(), userRecord.password!.toString());
        
        if(!checkPwd){
            throw new Error('Incorrect password');
        }

        if(!userRecord.token){
            throw new Error('User not logged in');
        }   

        try {
            //future check of jwt token
            const decoded = JSON.stringify(decoder(userRecord.token),null,4);
        }catch(err){
            throw new Error("Unable to decode token");
        }

        userRecord.updateOne({ "token":""},(err: Error, res: string) =>{
            console.log("deleted token by user");
        })

        return {
            email: userRecord.email,
        }
    }

    public async hasGrant(email: string, token: string): Promise<any> {
        const userRecord = await UserModel.findOne({ token });

        if(!userRecord){
            throw new Error("User not logged in. Please log in.");
        }

        try {
            //future check of jwt token
            const decoded = JSON.stringify(decoder(userRecord.token),null,4);
        }catch(err){
            throw new Error("Unable to decode token");
        }

        if(userRecord.role != "admin"){
            throw new Error("Unauthorized");
        }

        return {
            has_grant: true,
        }
        
        
    }
}


