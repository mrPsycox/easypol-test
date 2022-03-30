import { Application, Request, Response, } from "express";
import AuthService from "../services/auth";

export default (app:Application) => {

    app.post('/businessaccount', async(req: Request, res: Response) => {
        const email = req.body.email;
        const token = req.body.token;
    
        try {
            const authServiceInstance = new AuthService();
            const { has_grant } = await authServiceInstance.hasGrant(email, token);
            
            if(has_grant == true){
                return res.status(200).json({ email, "status":"authorized" }).end();
            }
            else{
                return res.status(401).json({ email, "status":"unauthorized" }).end();
            }
    
        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something wrong! Do you have the right grant [admin]?" });
        }
    
    });

}

