
import * as mongoose from 'mongoose'

import { EventToQueryResponseBinding } from './EventToQueryResponseBinding'

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

export const model: mongoose.Model<any> = MessageModel

export const baseQuery = new EventToQueryResponseBinding('message-view', model, true)

export const queries = [ baseQuery ]
