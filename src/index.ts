import express from 'express';
import { json } from 'body-parser';
import routes from './routes';
import mongoose , { ConnectOptions} from 'mongoose';

const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions;

mongoose.connect("mongodb://admin:root@127.0.0.1:27017/my_db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",mongoOpts,(err) => {
    if(err) console.log(err);
    else console.log("mongodb connected");
});


const app = express();

app.use(json());
app.use('/api',routes)


app.listen(3000, async () => {

    console.log("Server started at http://localhost:3000");

});