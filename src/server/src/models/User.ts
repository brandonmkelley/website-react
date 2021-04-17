
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

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

export const UserModel = mongoose.model<IUser>('User', UserSchema)

export const model = UserModel

const userViewQuery = new EventQuery<IUser>('user-view',
    () => model.find({}))

export const queries = [ userViewQuery ]
