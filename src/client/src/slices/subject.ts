
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        all: (state: AppState, action: any) => {
            return ({ ...state, subjects: action.payload })
        }
    }
})
