
import * as mongoose from 'mongoose'

import { EventToQueryResponseBinding } from './EventToQueryResponseBinding'

import IContent from 'model/build/IContent'

const ContentSchema = new mongoose.Schema<IContent>({
    topic: { type: String },
    name: { type: String },

    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, {
    timestamps: true
});

export const ContentModel = mongoose.model<IContent>('Content', ContentSchema)

export const model: mongoose.Model<any> = ContentModel

/*
export const baseQuery = new EventQuery<IMessage>('message-view',
    () => model.find({}))
*/

export const baseQuery = new EventToQueryResponseBinding('content-view', model, true)

export const queries = [ baseQuery ]
