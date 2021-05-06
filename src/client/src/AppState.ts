
import { IUser } from '../../model/src/IUser'
import { ISubject } from '../../model/src/ISubject'
import { IMessage } from '../../model/src/IMessage'

export interface AppState {
    layoutPlatform?: string | null,
    layoutNavHeight?: string | null,
    layoutJumboHeight?: string | null,
    layoutCardHeight?: string | null,
    userEmail?: string | null,
    userSid?: string | null,
    user?: IUser | null,
    users?: Record<string, IUser> | null,
    subjects?: Record<string, ISubject> | null,
    messages?: Record<string, IMessage> | null
}

export const initialState : AppState = {
    layoutPlatform: 'Unknown',
    layoutNavHeight: '50px',
    layoutJumboHeight: '50px',
    layoutCardHeight: '50px',
    userEmail: null,
    userSid: null,
    user: null,
    users: {},
    messages: {},
    subjects: {}
}
