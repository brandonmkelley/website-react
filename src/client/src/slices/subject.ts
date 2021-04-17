
import { createSlice } from '@reduxjs/toolkit'

import { AppState, initialState } from '../AppState'

export const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        view: (state: AppState, action: any) => {
            return ({ ...state, subjects: action.payload })
        }
    }
})
