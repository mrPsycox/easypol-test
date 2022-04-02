import mongoose, { ConnectOptions } from "mongoose";
import bankaccountModel from "./src/models/bankaccount";


require('dotenv').config();

let mongouri = process.env.MONGO_URI as string;

const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;

mongoose.connect(mongouri,mongoOpts,(err) => {
    if(err) console.log(err);
    else console.log("mongodb connected");
});

const csvFilePath='/home/mrpsycox/workdir_git/contoA.csv';
const csv =  require('csvtojson');

csv()
.fromFile(csvFilePath)
.then((jsonObj:any)=>{
    console.log(jsonObj);

    
    const target = bankaccountModel.findOne({ "name":"contoA"});
    target.updateOne({
        $set: {
            "transactions": jsonObj,
        }, function (err:any,res:any) {
            console.log(err,res)
        }
    }).exec();
    

    console.log('fine import')
    });
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 

