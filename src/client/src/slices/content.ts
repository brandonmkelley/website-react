
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const contentSlice = createSlice({
    name: 'content',
    initialState: initialState,
    reducers: {
        view: (state: AppState, action: any) => {
            return ({ ...state, content: action.payload.data })
        }
    }
})
