
import React, { useContext, useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container, Form, FormControl, FormControlProps } from 'react-bootstrap'

import { layoutSlice } from '../slices/layout'

import { EVENTS } from 'api/build'
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

        if (typeof(userSid) === 'string')
            subscribe(new Subscriber(userSid, EVENTS.API_SOCKET_SUB_USER_ID))

        return () => { unsubscribe(EVENTS.API_SOCKET_SUB_USER_ID) }
    }, [location.pathname, userSid])

    const user = useSelector((state: any) => state.user)

    const [ email, setEmail ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName] = useState('')
    const [ pendingChanges, setPendingChanges ] = useState(false)

    const firstNameInputRef = useRef<HTMLInputElement>(null)
    const lastNameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setEmail(user?.email)
        setFirstName(user?.firstName)
        setLastName(user?.lastName)

        endInputRefSaveAnimation(firstNameInputRef)
        endInputRefSaveAnimation(lastNameInputRef)
        setPendingChanges(false)
    }, [user])

    function changeFirstName(firstName: string) {
        setFirstName(firstName)
        setPendingChanges(true)
        startInputRefSaveAnimation(firstNameInputRef)
    }

    function changeLastName(lastName: string) {
        setLastName(lastName)
        setPendingChanges(true)
        startInputRefSaveAnimation(lastNameInputRef)
    }

    function startInputRefSaveAnimation(ref: React.RefObject<HTMLInputElement>) {
        ref.current!.className += ' text-warning'
    }

    function endInputRefSaveAnimation(ref: React.RefObject<HTMLInputElement>) {
        const currentClasses = ref.current!.className

        if (currentClasses.includes('text-warning')) {
            const baseClasses = currentClasses.split('text-warning').join('')

            ref.current!.className = baseClasses + ' text-success'

            setTimeout(() => {
                ref.current!.className = baseClasses
            }, 500)
        }
    }

    function emitUser() {
        if (pendingChanges) {
            const userUpdate: any = { _id: user._id }
        
            if (firstName)
                userUpdate.firstName = firstName
    
            if (lastName)
                userUpdate.lastName = lastName
            
            socket.emit(EVENTS.API_SOCKET_PUT_USER_ID, { type: 'update', user: userUpdate } )
        }
    }

    /*
    function emitChange(key: string, value: string) {
        const userUpdate: any = { _id: user._id }
        userUpdate[key] = value
        socket.emit('user', { type: 'update', user: userUpdate })
    }
    */

    return (<React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={ 12 } className="display-4 mt-3 mb-4">Account Settings</Col>
                    <Col xs={ 12 } sm={ 6 } md={ 4 } className="mb-4" style={{ maxWidth: '300px' }}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            value={ email || '' }
                            disabled={ true }
                            aria-label="Account Email Input" />
                    </Col>
                    <Col sm={ 6 } className="d-none d-sm-block d-md-none"></Col>
                    <Col xs={ 12 } sm={ 6 } md={ 4 } className="mb-4" style={{ maxWidth: '300px' }}>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            ref={ firstNameInputRef }
                            value={ firstName || '' }
                            onChange={ e => {
                                changeFirstName(e.target.value)
                            }}
                            onBlur={ emitUser }
                            aria-label="Account First Name Input"/>
                    </Col>
                    <Col xs={ 12 } sm={ 6 } md={ 4 } className="mb-4" style={{ maxWidth: '300px' }}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            ref={ lastNameInputRef }
                            value={ lastName || '' }
                            onChange={ e => {
                                changeLastName(e.target.value)
                            }}
                            onBlur={ emitUser }
                            aria-label="Account Last Name Input"/>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>)
}
