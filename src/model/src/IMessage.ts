
import { Document } from 'mongoose'

import { IUser } from './IUser'
import { ISubject } from './ISubject'

export interface IMessage extends Document {
    subjectId: ISubject['_id'],
    body: String,
    fromUserID: IUser['_id'],
    recipientUserID: [IUser['_id']],
    informationalUserID: [IUser['_id']],
    sentDt: Date,
    
    updatedBy: String,
    updatedAt: Date,
    createdBy: String,
    createdAt: Date
}
