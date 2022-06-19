
import { Document } from 'mongoose'

export default interface IContent extends Document {
    topic: String,
    name: String,
    
    updatedBy: String,
    updatedAt: Date,
    createdBy: String,
    createdAt: Date
}
