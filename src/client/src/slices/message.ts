
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const messageSlice = createSlice({
    name: 'message',
    initialState: initialState,
    reducers: {
        all: (state: AppState, action: any) => {
            return ({ ...state, messages: action.payload })
        }
    }
})
