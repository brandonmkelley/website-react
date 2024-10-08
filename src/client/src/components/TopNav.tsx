
import React, { useContext, useRef, useState } from 'react'

import firebase from 'firebase'

import { useSelector } from 'react-redux'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
// import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

import { Link } from 'react-router-dom'

import { ServiceContext } from '../index'
import { NavDropdown } from 'react-bootstrap'

export interface TopNavParams {
    height: string,
}

export default function(params: TopNavParams) {

    const services = useContext(ServiceContext)
    const firebaseApp = services.firebaseApp
    const socket = services.socket

    const userEmail = useSelector((state: any) => state.userEmail)

    const signInEmailRef = useRef(null)
    const signInPassRef = useRef(null)
    const signInButtonRef = useRef(null)

    const [newAccountAlertVisible, setNewAccountAlertVisible] = useState(false)
    const [signInError, setSignInError] = useState('')

    const catchSignInError = (e: any) => {
        setSignInError(e.message)
        setNewAccountAlertVisible(true)
    }

    const afterSignIn = (e: any) => {
        // If the event isn't undefined, then the create account or sign in is successful.
        if (typeof(e) !== 'undefined')
            setNewAccountAlertVisible(false)
    }

    const signIn = (e: any) => {
        e.preventDefault()

        firebase
            .auth(firebaseApp)
            .signInWithEmailAndPassword(
                (signInEmailRef.current || { value: '' }).value,
                (signInPassRef.current || { value: '' }).value)
            .catch(catchSignInError)
            .then(afterSignIn)
    }

    const createAccount = () => {
        firebase
            .auth(firebaseApp)
            .createUserWithEmailAndPassword(
                (signInEmailRef.current || { value: '' }).value,
                (signInPassRef.current || { value: '' }).value)
            .catch(catchSignInError)
            .then(e => {
                afterSignIn(e)
/*
                const currentUser = firebase.auth(firebaseApp).currentUser

                if (currentUser !== null)
                    currentUser
                        .getIdToken()
                        .then(sid => socket.emit('insert-user', { sid: sid, email: currentUser.email }))
                        */
            })
    }

    const signOut = () => {
        firebase.auth(firebaseApp).signOut()
    }
    
    const padToHeight = Math.floor((parseInt(params.height) - 40) / 2);
    const includeProducts = false
    const includeCalendar = false

    return (
        <Navbar bg="transparent" variant="light" expand="lg" style={{ paddingTop: padToHeight, paddingBottom: padToHeight }}>
            <Navbar.Brand as={Link} to="/">Brandon M. Kelley</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    { userEmail && userEmail == 'brandonmkelley@outlook.com' &&
                        <NavDropdown title="Config" id="configDropDown">
                            <Nav.Link as={Link} to="/config/content">Content</Nav.Link>
                        </NavDropdown>
                    }

                    { includeCalendar && userEmail &&
                        <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
                    }

                    { includeProducts && userEmail &&
                        <NavDropdown title="Products" id="productsDropDown">
                            <NavDropdown title="FlexWorks" id="flexWorksDropDown">
                                <Nav.Link as={Link} to="/flexworks/chat">Chat</Nav.Link>
                                <Nav.Link as={Link} to="/flexworks/email">Email</Nav.Link>
                            </NavDropdown>
                        </NavDropdown>
                    }

                    { includeProducts && userEmail && 
                        <span className="fa fa-envelope p-1" style={{ fontSize: '16px' }}></span>
                    }
                    
                    {/*
                <Nav.Link as={Link} to="/media">Media</Nav.Link>
                <Nav.Link as={Link} to="/app" style={{ visibility: ((userEmail) ? 'visible' : 'hidden') }}>App</Nav.Link>
                
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
                */}
                </Nav>
                
                { !userEmail &&
                    <Form inline onSubmit={ signIn }>
                        <FormControl ref={ signInEmailRef } type="text" placeholder="Email" className="mr-sm-2" />
                        <FormControl ref={ signInPassRef } type="password" placeholder="Password" className="mr-sm-2" />
                        <Button ref={ signInButtonRef } variant="outline-primary" type="submit" onClick={ signIn }>Get started</Button>

                        <Overlay target={ signInButtonRef.current } show={ newAccountAlertVisible } placement="bottom-end">
                            {(props) => (
                                <Popover id="create-account-popover" { ...props }>
                                    <Popover.Title as="h3" style={{ color: 'red', textAlign: 'center' }}>Login failed.</Popover.Title>
                                    <Popover.Content>
                                        <p><b style={{ color: 'red' }}>An error occurred: </b>{ signInError }</p>
                                        <p>Please verify that your login information is correct, or create an account below.</p>
                                            <Button className="mr-2" variant="outline-danger" onClick={ () => setNewAccountAlertVisible(false) }>Dismiss</Button>
                                            <Button variant="outline-success" onClick={ createAccount }>Create account</Button>
                                    </Popover.Content>
                                </Popover>
                            )}
                        </Overlay>
                    </Form>
                }
                { userEmail &&
                    <Navbar.Text>Logged in as: <b style={{ color: '#777' }}>{ userEmail }</b></Navbar.Text>
                }
                { userEmail && 
                    <Nav.Link as={Link} to="/account"
                        className="fa fa-user-circle pt-2 pb-1 mt-0 mb-0"
                        style={{ fontSize: '16px' }}></Nav.Link>
                }
                { userEmail &&
                    <Navbar.Text><Form inline>
                        <Button variant="outline-danger" onClick={ signOut }>Sign out</Button>
                    </Form></Navbar.Text>
                }
                { /*userEmail && 
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Submit</Button>
                    </Form>
                    */
                }
            </Navbar.Collapse>
        </Navbar>       
    )
}
