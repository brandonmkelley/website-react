
import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap'

import { layoutSlice } from '../slices/layout'

import useDatabaseSubscription, { Subscriber } from '../slices'

export default function() {

    const dispatch = useDispatch()
    const location = useLocation()

    const { subscribe, unsubscribe } = useDatabaseSubscription()

    const userSid: string | null | undefined = useSelector((state: any) => state.userSid)

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopNoScroll())

        if (userSid) {
            subscribe(new Subscriber(userSid, 'user-all'))
            subscribe(new Subscriber(userSid, 'user-id'))
        }
            
        //subscribe('message-all')

        return () => {
            unsubscribe('user-all')
            unsubscribe('user-id')
            //unsubscribe('message-all')
        }
    }, [location.pathname, userSid])

    const user: object | null | undefined = useSelector((state: any) => state.user)

    useEffect(() => {
        console.log(user)
    }, [user])

    return (<React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={ 12 } className="display-4">
                        Hello, <b></b>
                    </Col>
                    <Col xs={ 12 } lg={ 4 }>
                        Hello grid world!
                    </Col>
                </Row>
            </Container>
        </React.Fragment>)
}
