
import React, { useEffect, useContext } from 'react'

import * as firebase from 'firebase'

import { ServiceContext } from './index'

import { useSelector, useDispatch } from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'

import TopNav from './components/TopNav'

import PersonalHome from './pages/PersonalHome'

import { authSlice } from './slices/auth'

import Config_Content from './pages/Config_Content'
import PersonalCalendar from './pages/PersonalCalendar'
import FlexWorks_Chat from './pages/FlexWorks_Chat'
import FlexWorks_Email from './pages/FlexWorks_Email'
import FlexWorks_Account from './pages/FlexWorks_Account'

export default function() {
  const dispatch = useDispatch()
  const services = useContext(ServiceContext)
  const firebaseApp = services.firebaseApp

  // Bind auth state changed listener to auth slice to update UI state.
  useEffect(() => {
    firebase.auth(firebaseApp).onAuthStateChanged(result => {
      if (result) {
        const currentUser = firebase.auth(firebaseApp).currentUser

        if (currentUser !== null)
            currentUser
                .getIdToken()
                .then(sid => dispatch(authSlice.actions.onAuthStateChanged({ sid: sid, email: currentUser.email })))
      }
      else
        dispatch(authSlice.actions.onAuthStateChanged({ email: null, sid: null }))
    })
  }, [ firebaseApp ])

  const navHeight = useSelector((state: any) => state.layoutNavHeight) || ''
  const appHeight = useSelector((state: any) => state.layoutAppHeight) || ''
  const userEmail = useSelector((state: any) => state.userEmail)

  return (
    <BrowserRouter>
      <Row noGutters={ true }>
        <Col xs={ 12 }><TopNav height={ navHeight }/></Col>
        <div style={{ height: appHeight, width: '100%' }}>
          <Switch>
            <Route exact path="/" component={ PersonalHome }/>
            { userEmail && userEmail == 'brandonmkelley@outlook.com' && 
              <Route exact path="/config/content" component={ Config_Content }/> }
            { userEmail &&
              <Route exact path="/calendar" component={ PersonalCalendar }/> }
            <Route exact path="/flexworks/chat" component={ FlexWorks_Chat }/>
            <Route exact path="/flexworks/email" component={ FlexWorks_Email }/>
            <Route exact path="/flexworks/account" component={ FlexWorks_Account }/>
            { /*
            <Route path="/media/:shortName?" component={ Media } />
            <Route path="/app" component={ App } />
            */ }
          </Switch>
        </div>
        
      </Row>
    </BrowserRouter>
  )
}
