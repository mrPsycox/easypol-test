import * as mongoose from 'mongoose';


interface bankAccountInterface extends mongoose.Document {
    name: string,
    date: Date,
    owner: string,
    type: string,
    balance: Number,
    total_income: Number,
    total_outgo: Number,
    transactions: [mongoose.Schema.Types.ObjectId] 
}

interface transactionInterface extends mongoose.Document {
    date: Date,
    balance: Number,
    income: Number,
    outgo: Number,
}

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    balance: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    outgo: {
        type: Number,
        required: true
    }
});


const bankAccountSchema = new mongoose.Schema({
    
    name : {
        type: String,
        required: true,
    },
    date: { type: Date, default: Date.now },
    owner: { type: String, required: true },
    type: {type: String, required: true},
    balance: {
        type: Number,
    },
    total_income: {
        type: Number,
    },
    total_outgo: {
        type: Number,
    },
    transactions: {
        type: [transactionSchema]
    }

});

export default mongoose.model<bankAccountInterface & transactionInterface & mongoose.Document>('bankaccount',bankAccountSchema,'bankaccounts');

