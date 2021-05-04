
import { Document } from 'mongoose'

export interface ISubject extends Document {
    name: { type: String },
    createdUser: { type: String, required: true }
}
