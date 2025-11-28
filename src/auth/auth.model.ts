import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from './auth.interface';

/**
 * User Schema Definition
 */
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // 🔧 FIX: Use optional chaining and type assertion
        if ('password' in ret) {
          delete (ret as any).password;
        }
        if ('__v' in ret) {
          delete (ret as any).__v;
        }
        return ret;
      }
    }
  }
);


/**
 * User Model Export
 */
export const User = mongoose.model<IUserDocument>('User', userSchema);