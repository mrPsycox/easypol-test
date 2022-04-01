import * as mongoose from 'mongoose';


interface bankAccountInterface {
    name: string,
    date: Date,
    owner: string,
    balance: Number,
    total_income: Number,
    total_outgo: Number,
    transactions: [mongoose.Schema.Types.ObjectId] 
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

export default mongoose.model<bankAccountInterface & mongoose.Document>('bankaccount',bankAccountSchema,'bankaccounts');

