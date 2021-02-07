
import { createSlice } from '@reduxjs/toolkit'

import { initialState } from '../AppState'

import { message } from '../data/flexworks.json'

export const messageSlice = createSlice({
    name: 'message',
    initialState: { ...initialState, messages: message},
    reducers: {}
})
