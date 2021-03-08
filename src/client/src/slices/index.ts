
import { useContext, useReducer } from 'react'

import { Action } from 'redux'

import { useDispatch } from 'react-redux'

import { ServiceContext } from '../'

import { userSlice } from './user'
import { subjectSlice } from './subject'
import { messageSlice } from './message'

export const dataSlices = [ subjectSlice, userSlice, messageSlice ]

const allSlicesMap = dataSlices.reduce((result: any, slice: any) => {
    for (var actionName of Object.keys(slice.actions))
        result[slice.name + '-' + actionName] = (slice.actions as { [name: string]: Action })[actionName]

    return result
}, {})

function useDatabaseState() {
    const { socket } = useContext(ServiceContext)
    const dispatch = useDispatch()

    const subscribe = (state: any, action: any) => {
        const event = action as string;

        //console.log('Subscribing to Socket IO event: ' + event)

        socket.on(event, (result: any) => {
            dispatch(allSlicesMap[event](result))

            //console.log('Socket event triggered for event: ' + event)
            //console.log('Dispatching the following result: ')
            //console.log(result)
        });

        socket.emit(event)

        return { ...state }
    }

    return useReducer(subscribe, null)
}

export default () => {
    const { socket } = useContext(ServiceContext)

    const [_, subscribe] = useDatabaseState()

    const unsubscribe = (event: string) => socket.off(event)

    return { subscribe, unsubscribe }
}
