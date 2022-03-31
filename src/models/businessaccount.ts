import * as mongoose from 'mongoose';

interface businessaccountInterface {
    username: string;
    accounts: string[];
    created_by: string;
  }

const businessaccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    accounts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    created_by: {
        type: String,
    }

});

export default mongoose.model<businessaccountInterface & mongoose.Document>('businessaccount',businessaccountSchema,'businessaccount');
