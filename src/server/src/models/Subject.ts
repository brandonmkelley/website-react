
import * as mongoose from 'mongoose'

import { EventToQueryResponseBinding } from './EventToQueryResponseBinding'

import { ISubject } from '../../../model/src/ISubject'

const SubjectSchema = new mongoose.Schema<ISubject>({
    name: { type: String },
    
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, {
    timestamps: true
});

export const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema)

export const model: mongoose.Model<any> = SubjectModel

const baseQuery = new EventToQueryResponseBinding('subject-view', model, true)

export const queries = [ baseQuery ]
