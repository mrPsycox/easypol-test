import express from 'express';
import { json } from 'body-parser';
import routes from './routes';
import mongoose , { ConnectOptions} from 'mongoose';

require('dotenv').config();


const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;


let mongouri = process.env.MONGO_URI as string;

mongoose.connect(mongouri,mongoOpts,(err) => {
    if(err) console.log(err);
    else console.log("mongodb connected");
});

const app = express();

app.use(json());
app.use('/api',routes)


app.listen(3000, async () => {

    console.log("Server started at http://localhost:3000");

});