import { Application, Request, Response, } from "express";
import AuthService from "../services/auth";
import businessaccountService from "../services/businessaccount";

export default (app:Application) => {

    app.post('/businessaccount/register', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccountname = req.body.username
    
        try {
            const authServiceInstance = new AuthService();
            const { email,has_grant } = await authServiceInstance.hasGrant(token);
            
            if(has_grant == true){

                const businessaccountServiceInstance = new businessaccountService();

                const {username} = await businessaccountServiceInstance.register(businessaccountname,token,email)

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

    app.post('/businessaccount/createuser', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccount = req.body.username;
        const new_user = req.body.newuser;
        const new_pwd = req.body.newpwd;

        try{

            const authServiceInstance = new AuthService();

            const { email,has_grant } = await authServiceInstance.hasGrant(token);

            if(has_grant == true){

                const businessaccountServiceInstance = new businessaccountService();

                const { username, accounts } = await businessaccountServiceInstance.createUser(businessaccount,new_user,new_pwd);

                return res.status(200).json({ username, accounts ,"status":"updated" }).end();

            }else{
                return res.status(401).json({ email, "status":"unauthorized" }).end();
            }


        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something wrong! Do you have the right grant [admin]?" });
        }

    });

    app.post('/businessaccount/deleteuser', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccount = req.body.username;
        const user = req.body.user;

        try {

            const authServiceInstance = new AuthService();
            const { email,has_grant } = await authServiceInstance.hasGrant(token);

            if( has_grant == true){

                const businessaccountServiceInstance = new businessaccountService();
                const { username, accounts } = await businessaccountServiceInstance.deleteUser(businessaccount,user);
                return res.status(200).json({ username, accounts ,"status":"deleted" }).end();

            }else{
                return res.status(401).json({ email, "status":"unauthorized" }).end();
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something wrong! Do you have the right grant [admin]?" });
        }
    });

    app.patch('/businessaccount/updateuser', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccount = req.body.username;
        const user = req.body.user;
        const newpwd = req.body.newpwd;

        try {

            const authServiceInstance = new AuthService();
            const { has_grant } = await authServiceInstance.hasGrant(token);

            if(has_grant == true){

                const businessaccountServiceInstance = new businessaccountService();
                const { username, accounts } = await businessaccountServiceInstance.updateUser(businessaccount,user,newpwd);

                return res.status(200).json({ username, accounts ,"status":"updated" }).end();

            }else{

            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something wrong! Do you have the right grant [admin]?" });
        }


    });

    app.get('/businessaccount/getusers', async(req: Request, res: Response) => {
        const token = req.body.token;
        const businessaccount = req.body.username;

        try {

            const authServiceInstance = new AuthService();
            const { has_grant } = await authServiceInstance.hasGrant(token);

            if(has_grant){
                const businessaccountServiceInstance = new businessaccountService();
                const { users } = await businessaccountServiceInstance.getUsers(businessaccount);
        
                return res.status(200).json({ users }).end();
            }else{
                return res.status(401).json({ message: "Unauthorized" });

            }


        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Internal Server error" });
        }
        



    });
}

