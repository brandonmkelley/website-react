
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        'view': (state: AppState, action: any) => {
            return ({ ...state, chat: action.payload.data })
        }
    }
})
