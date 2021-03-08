
import * as mongoose from 'mongoose'
import { isStringLiteral } from 'typescript';

export interface IUser extends mongoose.Document {
    email: String,
    firstName: String,
    lastName: String,
    createdUser: String
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    createdUser: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
