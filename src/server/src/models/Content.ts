
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { IContent } from '../../../model/src/IContent'

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

export const model = ContentModel

/*
export const baseQuery = new EventQuery<IMessage>('message-view',
    () => model.find({}))
*/

export const baseQuery = new EventQuery('content-view', model)

export const queries = [ baseQuery ]
