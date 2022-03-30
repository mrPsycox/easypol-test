import bcrypt from 'bcrypt';
import UserModel from "../models/user"
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export default class AuthService {
    constructor(){}


    private generateJWT(user: any){
        return jwt.sign({
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
            }
        }, 'MySuP3R_z3kr3t.', { expiresIn: '6h' });
    }

    public async create(email: String, password: String, role: String): Promise<any> {
        const salt = randomBytes(32);
        const pwdHash = await bcrypt.hash(password.toString(), Number(salt));

        console.log(pwdHash);

        const userRecord = await UserModel.create({
           email,
           password: pwdHash,
           salt: salt.toString('hex'),
           role,
        });
        const token = this.generateJWT(userRecord);

        return {
            
            email: userRecord.email,
            username: userRecord.username,
            token,
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
        

        return {
            email: userRecord.email,
            username: userRecord.username,
            token: this.generateJWT(userRecord),
        }
    }
}