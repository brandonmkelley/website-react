
export interface AppState {
    layoutPlatform?: string | null,
    layoutNavHeight?: string | null,
    layoutJumboHeight?: string | null,
    layoutCardHeight?: string | null,
    userEmail?: string | null,
    userSid?: string | null,
    userID?: string | null,
    users?: object | null,
    messages?: object | null,
    subjects?: object | null
}

export const initialState : AppState = {
    layoutPlatform: 'Unknown',
    layoutNavHeight: '50px',
    layoutJumboHeight: '50px',
    layoutCardHeight: '50px',
    userEmail: null,
    userSid: null,
    users: {},
    messages: {},
    subjects: {}
}
