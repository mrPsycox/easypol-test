import mongoose, { ConnectOptions } from "mongoose";
import bankaccountModel from "./src/models/bankaccount";


const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;

mongoose.connect("mongodb://admin:root@127.0.0.1:27017/my_db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",mongoOpts,(err) => {
    if(err) console.log(err);
    else console.log("mongodb connected");
});

const csvFilePath='/home/mrpsycox/workdir_git/contoC.csv';
const csv =  require('csvtojson');

csv()
.fromFile(csvFilePath)
.then((jsonObj:any)=>{
    console.log(jsonObj);

    
    const target = bankaccountModel.findOne({ "name":"contoC"});
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

