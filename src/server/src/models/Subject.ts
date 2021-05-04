
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { ISubject } from '../../../model/src/ISubject'

const SubjectSchema = new mongoose.Schema<ISubject>({
    name: { type: String },
    createdUser: { type: String, required: true }
}, {
    timestamps: true
});

export const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema)

export const model = SubjectModel

/*
const subjectViewQuery = new EventQuery<ISubject>('subject-view',
    () => model.find({}))
*/

const baseQuery = new EventQuery('subject-view', model)

export const queries = [ baseQuery ]
