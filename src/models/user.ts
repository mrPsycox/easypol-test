import * as mongoose from 'mongoose';

interface UserInterface {
  email: string;
  password?: string;
  salt?: string;
  username: string;
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

  username: {
    type: String
  },

  role: {
    type: String,
    required: true,
    default: 'collaboratore', // Possible values: collaboratore | admin 
  }

})

export default mongoose.model<UserInterface & mongoose.Document>('User', UserSchema,'easypol-db')