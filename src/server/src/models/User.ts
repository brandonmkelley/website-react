
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { IUser } from '../../../model/src/IUser'

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, {
    timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema)

export const model = UserModel

export const baseQuery = new EventQuery('user-view', model)

export const queries = [ baseQuery ]
