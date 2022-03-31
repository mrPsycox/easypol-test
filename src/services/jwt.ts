import jwt, {  JwtPayload } from 'jsonwebtoken';

export default class JwtService {
    constructor(){};

    public generateJWT(user: any){
        return jwt.sign({
            data: {
                _id: user._id,
                email: user.email,
            }
        }, 'MySuP3R_z3kr3t.', { expiresIn: '6h' });
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

