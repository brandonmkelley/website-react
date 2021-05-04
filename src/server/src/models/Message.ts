
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import { IUser } from '../../../model/src/IUser'
import { ISubject } from '../../../model/src/ISubject'

export interface IMessage extends mongoose.Document {
    subjectId: ISubject['_id'],
    body: String,
    fromUserID: IUser['_id'],
    recipientUserID: [IUser['_id']],
    informationalUserID: [IUser['_id']],
    sentDt: Date,
    createdUser: String
}

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
    createdUser: { type: String, required: true }
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
