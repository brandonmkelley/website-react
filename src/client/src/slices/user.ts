
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        all: (state: AppState, action: any) => {
            console.log(action)
            return ({ ...state, users: action.payload })
        }
    }
})
