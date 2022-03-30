import { json } from "body-parser";
import { Application, Request, Response } from "express"
import AuthService from "../services/auth";


export default (app: Application) => {

    app.post('/user/create', async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;
            const authServiceInstance = new AuthService();
            const { applied_role } = await authServiceInstance.create(email,password,role);
            
            return res.json({ email, "status":"created", applied_role }).status(200).end();

        }catch(err) {
            console.log(err)
            return res.status(500).json({ message: "Something wrong!" })
        }
    });
    
    app.post('/user/login', async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;

        try {

            const authServiceInstance = new AuthService();
            const { token } = await authServiceInstance.login(email,password);
            return res.status(200).json({ email, token }).end();

        }catch(err) {
            return res.status(401).json({ message: "Email or Password is Wrong!" })
        }
    });

    app.post('/user/logout', async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;

        try{
            const authServiceInstance = new AuthService();
            await authServiceInstance.logout(email,password);
            
            
        }catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something wrong! [LOGOUT]" });
        }
    });


}