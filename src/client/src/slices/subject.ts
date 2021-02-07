
import { createSlice } from '@reduxjs/toolkit'

import { initialState } from '../AppState'

import { subject } from '../data/flexworks.json'

export const messageSlice = createSlice({
    name: 'message',
    initialState: { ...initialState, subjects: subject },
    reducers: {}
})
