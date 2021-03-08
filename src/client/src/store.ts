
import { configureStore } from "@reduxjs/toolkit"

import reduceReducers from 'reduce-reducers'

import { layoutSlice } from './slices/layout'
import { authSlice } from './slices/auth'
import { dataSlices } from './slices'

//const store = configureStore({ reducer: combineReducers({ layoutReducer, authReducer }) })

const reducer = reduceReducers(
    layoutSlice.reducer,
    authSlice.reducer,
    ...dataSlices.map(slice => slice.reducer)
) as any

const store = configureStore({ reducer: reducer })

export default store
