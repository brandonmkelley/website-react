
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { IUser } from '../../../model/src/IUser'

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

export const baseQuery = new EventQuery('user-view', model)

export const queries = [ baseQuery ]
