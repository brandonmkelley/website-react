
import { Document } from 'mongoose'

export interface IUser extends Document {
    email: String,
    firstName: String,
    lastName: String,
    
    updatedBy: String,
    updatedAt: Date,
    createdBy: String,
    createdAt: Date
}