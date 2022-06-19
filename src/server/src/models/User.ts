
import * as mongoose from 'mongoose'

import { QueryPipelineBuilder, EventToQueryResponseBinding } from './EventToQueryResponseBinding'

import IUser from 'model/build/IUser'

import { EVENTS } from '../../../api/src'

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, {
    timestamps: true
});


export const UserModel = mongoose.model<IUser>('User', UserSchema)

export const model = UserModel


export const baseQuery = new EventToQueryResponseBinding('user-view', model, true)

function idPipeline(appContext?: any) {
    const allUsers = baseQuery.responseQueryPipelineBuilder.aggregate(appContext)

    return allUsers.match({ _id: { $eq: appContext.user._id }}).pipeline()
}

const idQueryPipelineBuilder = new QueryPipelineBuilder<IUser>(model, idPipeline)

async function putUserID(appContext: any) {
    const user = await UserModel.findById(appContext.user._id)

    Object.assign(user, appContext.eventPayload.user)

    await user.save()
}

const subUserIDQuery = new EventToQueryResponseBinding(EVENTS.API_SOCKET_SUB_USER_ID,
    model, true, idQueryPipelineBuilder)

const putUserIDQuery = new EventToQueryResponseBinding(EVENTS.API_SOCKET_PUT_USER_ID,
    model, false, idQueryPipelineBuilder, putUserID)


export const queries = [ baseQuery, subUserIDQuery, putUserIDQuery ]
