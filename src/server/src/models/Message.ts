
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { IMessage } from '../../../model/src/IMessage'

const MessageSchema = new mongoose.Schema<IMessage>({
    email: { type: String },
    name: { type: String },
    handle: { type: String },
    subjectId: { type: mongoose.Schema.Types.ObjectId },
    body: { type: String },
    fromUserID: { type: mongoose.Schema.Types.ObjectId },
    recipientUserID: { type: [mongoose.Schema.Types.ObjectId] },
    informationalUserID: { type: [mongoose.Schema.Types.ObjectId] },
    sentDt: Date,
    
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, {
    timestamps: true
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema)

export const model = MessageModel

/*
export const baseQuery = new EventQuery<IMessage>('message-view',
    () => model.find({}))
*/

export const baseQuery = new EventQuery('message-view', model)

export const queries = [ baseQuery ]
