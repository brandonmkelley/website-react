
import * as mongoose from 'mongoose'

import { EventQuery } from './EventQuery'

import * as UserModel from './User'
import * as MessageModel from './Message'

function chatPipeline(appContext?: any, watchContext?: any) {
    const allMessages = MessageModel.baseQuery.aggregate()
    const changedMessages = MessageModel.baseQuery.aggregate(null, watchContext)
    const user = appContext.user

    const chatMessagePipeline = allMessages
        .unwind('recipientUserID')
        .match({ $expr: { $or: [
                { $eq: [ '$fromUserID', user._id ] },
                { $eq: [ '$recipientUserID', user._id ] }
            ] } })
        .addFields({ 'otherUserID': {
            $cond: {
                if: { $eq: [ '$fromUserID', user._id ] },
                then: '$recipientUserID',
                else: '$fromUserID'
            } } })
        .pipeline()

    const chatUserPipeline = allMessages.append(chatMessagePipeline)
        .group({ _id: '$otherUserID', sentDt: { $max: '$sentDt' } })
        .lookup({
            from: 'messages',
            let: { otherUserID: '$_id', sentDt: '$sentDt' },
            pipeline: changedMessages.append(chatMessagePipeline)
                .match({ $expr: { $and: [
                    { $eq: [ '$otherUserID', '$$otherUserID' ] },
                    { $eq: [ '$sentDt', '$$sentDt' ] }
                ]}})
                .limit(1)
                .pipeline(),
            as: 'message'
        })
        .match({ 'message': { $ne: [] }}) // Combined w/ lookup simulates inner join.
        .unwind('message')
        .replaceRoot('$message')
        .pipeline()

    return chatUserPipeline
}

const chatQuery = new EventQuery('chat-view', MessageModel.model, chatPipeline)

export const queries = [ chatQuery ]
