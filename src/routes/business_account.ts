import { Application, Request, Response, } from "express";
import AuthService from "../services/auth";
import businessaccountService from "../services/businessaccount";

export default (app:Application) => {

    app.post('/businessaccount/register', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccountname = req.body.name
    
        try {
            const authServiceInstance = new AuthService();
            const { email,has_grant } = await authServiceInstance.hasGrant(token);
            
            if(has_grant == true){

                const businessaccountServiceInstance = new businessaccountService();

                const {username} = await businessaccountServiceInstance.create(businessaccountname,token,email)

                
                return res.status(200).json({ username, "status":"created" }).end();
            }
            else{
                return res.status(401).json({ email, "status":"unauthorized" }).end();
            }
    
        }catch(err: any){
            console.log(err);
            if(err.message == 'Business account yet existing!') return res.status(409).json({ message: "Business account yet existing." });
            return res.status(500).json({ message: "Something wrong! Do you have the right grant [admin]?" });
        }


    
    });

}

