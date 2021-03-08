
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        all: (state: AppState, action: any) => {
            return ({ ...state, users: action.payload })
        }
    }
})
