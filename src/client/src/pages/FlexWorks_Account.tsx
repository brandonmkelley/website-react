
import React, { useContext, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container, FormControl } from 'react-bootstrap'

import { layoutSlice } from '../slices/layout'

import useDatabaseSubscription, { Subscriber } from '../slices'
import { ServiceContext } from '..'

export default function() {
    const dispatch = useDispatch()
    const location = useLocation()
    const { socket } = useContext(ServiceContext)

    const { subscribe, unsubscribe } = useDatabaseSubscription()

    const userSid: string | null | undefined = useSelector((state: any) => state.userSid)

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())

        if (userSid)
            subscribe(new Subscriber(userSid, 'user-id'))

        return () => { unsubscribe('user-id') }
    }, [location.pathname, userSid])

    const user = useSelector((state: any) => state.user)

    const [ email, setEmail ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName] = useState('')

    useEffect(() => {
        setEmail(user?.email)
        setFirstName(user?.firstName)
        setLastName(user?.lastName)
    }, [user])

    function emitUser() {
        const userUpdate: any = { _id: user._id }
        
        if (firstName)
            userUpdate.firstName = firstName

        if (lastName)
            userUpdate.lastName = lastName
        
        socket.emit('user', { type: 'update', user: userUpdate } )
    }

    function emitChange(key: string, value: string) {
        const userUpdate: any = { _id: user._id }
        userUpdate[key] = value
        socket.emit('user', { type: 'update', user: userUpdate })
    }

    return (<React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={ 12 } className="display-4 mb-4">Account Settings</Col>
                    <Col xs={ 12 } lg={ 4 }>
                        <FormControl
                            placeholder="Email"
                            value={ email || '' }
                            disabled={ true }
                            aria-label="Account Email Input"/>
                    </Col>
                    <Col xs={ 12 } lg={ 4 }>
                        <FormControl
                            placeholder="First Name"
                            value={ firstName || '' }
                            onChange={ e => {
                                setFirstName(e.target.value)
                                //emitChange('firstName', e.target.value)
                            }}
                            onBlur={ emitUser }
                            aria-label="Account First Name Input"/>
                    </Col>
                    <Col xs={ 12 } lg={ 4 }>
                        <FormControl
                            placeholder="Last Name"
                            value={ lastName || '' }
                            onChange={ e => {
                                setLastName(e.target.value)
                                //emitChange('lastName', e.target.value)
                            }}
                            onBlur={ emitUser }
                            aria-label="Account Last Name Input"/>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>)
}
