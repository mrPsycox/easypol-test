import * as mongoose from 'mongoose';

interface UserInterface {
  email: string;
  password?: string;
  salt?: string;
  role: string,
  token: string,
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  
  password: {
    type: String,
    required: true,
  },

  salt: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'collaboratore', // Possible values: collaboratore | admin 
  },
  token: {
    type: String,
    required: false,
  },

})

export default mongoose.model<UserInterface & mongoose.Document>('User', UserSchema,'users');