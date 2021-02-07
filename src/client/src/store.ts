
import { configureStore } from "@reduxjs/toolkit"

import reduceReducers from 'reduce-reducers'

import { layoutSlice } from './slices/layout'
import { authSlice } from './slices/auth'
import { messageSlice } from './slices/message'
import { subjectSlice } from './slices/subject'

//const store = configureStore({ reducer: combineReducers({ layoutReducer, authReducer }) })

const reducer = reduceReducers(
    layoutSlice.reducer,
    authSlice.reducer,
    subjectSlice.reducer,
    messageSlice.reducer
) as any

const store = configureStore({ reducer: reducer })

export default store
