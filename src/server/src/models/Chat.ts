
import * as mongoose from 'mongoose'

import { EventToQueryResponseBinding, QueryPipelineBuilder } from './EventToQueryResponseBinding'

import * as UserModel from './User'
import * as MessageModel from './Message'

import IMessage from 'model/build/IMessage'

function chatPipeline(appContext?: any, watchContext?: any) {
    const allMessages = MessageModel.baseQuery.responseQueryPipelineBuilder.aggregate(appContext)
    const changedMessages = MessageModel.baseQuery.responseQueryPipelineBuilder.aggregate(appContext, watchContext)

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

const chatQueryBuilder = new QueryPipelineBuilder<IMessage>(
    MessageModel.model, chatPipeline)

const chatQuery = new EventToQueryResponseBinding('chat-view', MessageModel.model, true, chatQueryBuilder)

export const queries = [ chatQuery ]
