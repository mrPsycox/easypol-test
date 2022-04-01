import * as mongoose from 'mongoose';

interface businessaccountInterface {
    username: string;
    accounts: mongoose.Schema.Types.ObjectId[];
    date: Date;
  }

const businessaccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    accounts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'}],
        required: true,
    },

    date: { type: Date, default: Date.now }

});

export default mongoose.model<businessaccountInterface & mongoose.Document>('businessaccount',businessaccountSchema,'businessaccount');
