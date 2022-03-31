import bcrypt from 'bcrypt';
import UserModel from "../models/user"
import { randomBytes } from 'crypto';
import JwtService from './jwt';
import { JwtPayload } from 'jwt-decode';

export default class AuthService {
    constructor(){}


   public async create(email: String, password: String, role: String): Promise<any> {
        try{

            const salt = randomBytes(32);
            const pwdHash = await bcrypt.hash(password.toString(), Number(salt));
    
            const userRecord = await UserModel.create({
               email,
               password: pwdHash,
               salt: salt.toString('hex'),
               role,
            });
    
            return {
                email: userRecord.email,
                applied_role: userRecord.role,
            }

        }catch(err: any){
            throw new Error(err.message);
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

        const jwtServiceInstance = new JwtService();

        if(!userRecord.token || userRecord.token == ""){
            const new_token = jwtServiceInstance.generateJWT(userRecord);
            userRecord.token = new_token;

            await userRecord.save();


            return {
            email: userRecord.email,
            token: new_token,
            }

        }else{

            const token_decoded = jwtServiceInstance.verifyJWT(userRecord.token) as JwtPayload;
            if (Date.now() >= token_decoded.exp! * 1000) {
                const new_token = jwtServiceInstance.generateJWT(userRecord);
                userRecord.token = new_token;
                await userRecord.save();

                return {
                    email: userRecord.email,
                    token: new_token,
                    }
              }else { //token not expired
                return {
                    email: userRecord.email,
                    token: userRecord.token,
                    }
              }
        }        
    }

    public async logout(email: string, password: string): Promise<any> {

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

        const jwtServiceInstance = new JwtService();

        const token_decoded = jwtServiceInstance.verifyJWT(userRecord.token) as JwtPayload;
        if (Date.now() >= token_decoded.exp! * 1000) {
            userRecord.token = "";
            await userRecord.save();
            throw new Error("Token Expired! Please login!");
          }

        userRecord.updateOne({ "token":""},(err: Error, res: string) =>{
            console.log("deleted token by user");
        })

        return {
            email: userRecord.email,
        }
    }

    public async hasGrant(token: string): Promise<any> {
        const userRecord = await UserModel.findOne({ token });

        if(!userRecord){
            throw new Error("User not logged in. Please log in.");
        }

        const jwtServiceInstance = new JwtService();

        const token_decoded = jwtServiceInstance.verifyJWT(token) as JwtPayload;
        if (Date.now() >= token_decoded.exp! * 1000) {
            userRecord.token = "";
            await userRecord.save();
            throw new Error("Token Expired! Please login!");
          }

        if(userRecord.role != "admin"){
            throw new Error("Unauthorized");
        }
        
        return {
            email: userRecord.email,
            has_grant: true,
        }
        
        
    }
}


