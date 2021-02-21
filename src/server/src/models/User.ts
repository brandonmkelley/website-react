
import * as mongoose from 'mongoose'
import { isStringLiteral } from 'typescript';

export interface IUser extends mongoose.Document {
    email: String,
    name: String,
    handle: String,
    createdUser: String
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String },
    name: { type: String },
    handle: { type: String },
    createdUser: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
