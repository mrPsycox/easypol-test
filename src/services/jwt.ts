import jwt from 'jsonwebtoken';
require('dotenv').config();

let secret_key = process.env.SECRET_KEY as string;


export default class JwtService {
    constructor(){};

    public generateJWT(user: any){


        return jwt.sign({
            data: {
                _id: user._id,
                email: user.email,
            }
        }, secret_key, { expiresIn: '6h' });
    }
    
    public verifyJWT(token: string){
        try{
    
            const decoded = jwt.decode(token);
            return decoded;
    
        }catch(err){
    
            console.log(err);
            return false;
        }
        
    
    }

}

