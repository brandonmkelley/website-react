
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        onAuthStateChanged: (state: AppState, action: any) => {
            var sid = action.payload.sid
            var email = action.payload.email
            return { ...state, userSid: sid, userEmail: email }
        }
    }
})
