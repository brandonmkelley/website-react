
import { Document } from 'mongoose'

export interface ISubject extends Document {
    name: { type: String },
    
    updatedBy: String,
    updatedAt: Date,
    createdBy: String,
    createdAt: Date
}
