
import * as express from "express"

const app = express()

import { createServer as createHTTPServer } from 'http'
import { createServer as createHTTPSServer } from 'https'
import * as fs from 'fs'

// Read -p argument to deploy prod
var server = null;
var port = null;

var pathIndex = process.argv.indexOf('-p')
var prod = pathIndex !== -1

if (prod) {
    const httpsOptions = {
    	key: fs.readFileSync('./static/privkey.pem'),
        cert: fs.readFileSync('./static/cert.pem'),
	ca: fs.readFileSync('./static/fullchain.pem')
    }
    
    server = createHTTPSServer(httpsOptions, app)
    port = 4430

    console.log('https server setup')
}

else {
    server = createHTTPServer(app)
    port = 8080
}

// Read -s argument if static files need to be served (prod only.)
var argStart = 0;

do {
    pathIndex = process.argv.indexOf('-s', argStart)

    if (pathIndex !== -1 && process.argv.length > pathIndex + 2) {
        var endpoint = process.argv[pathIndex + 1]
        var staticPath = process.argv[pathIndex + 2]
	console.log('Loading static files from path: ' + staticPath
		+ ' and hosting them at endpoint: ' + endpoint)
		app.use(endpoint, express.static(staticPath))
    }

    if (pathIndex !== -1)
       argStart = pathIndex + 3;
}
while (pathIndex !== -1 && argStart < process.argv.length)

import * as socketio from 'socket.io'
const io = socketio(server)

import * as mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/flexworks?replicaSet=rs0', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Mongo connection error:'))

import * as expressSession from 'express-session'
import * as socketSession from 'express-socket.io-session'
import * as mongoSession from 'connect-mongo'

const mongoStore = mongoSession(expressSession)

const appSession = expressSession({
    store: new mongoStore({
        mongooseConnection: db
    }),
    secret: 'foo',
    resave: true,
    saveUninitialized: true
})

app.use(appSession)

io.use(socketSession(appSession))

var firebaseAdmin = require('firebase-admin');

var firebaseAdminRef = firebaseAdmin.initializeApp({
credential: firebaseAdmin.credential.cert('./static/firebaseServiceAccount.json'),
    databaseURL: 'https://userportal-fa7ab.firebaseio.com'
  }, 'ADMIN');

import { ChangeEventUpdate } from "mongodb"

import * as userModel from './models/User'
import * as subjectModel from './models/Subject'
import * as messageModel from './models/Message'
import * as chatModel from './models/Chat'
import * as contentModel from './models/Content'

import { EventToQueryResponseBinding } from './models/EventToQueryResponseBinding'
import SocketIO = require("socket.io")

const modelSubscriptions = [
    userModel, subjectModel, messageModel, chatModel, contentModel ]

const User = userModel.model

modelSubscriptions.map(m => {
    // This nastiness will allow all queries to watch their base models.
    m.queries.map((q: EventToQueryResponseBinding<any>) => {
        if (q.responseQueryShouldBeWatched) {

            q.model.watch().on('change',
            (e: ChangeEventUpdate<mongoose.Model<any>>) => {
                const watchContext = {}
                watchContext[q.event] = e.documentKey

                Object.values(io.to(q.event).sockets).map(async s => {
                    const appContext: any = { user: s.handshake.session.user }
                    const result = await q.exec(appContext, watchContext)

                    if (result) {
                        const response = {
                            apimeta: {
                                scope: e.operationType,
                                query: q.event,
                                _id: e.documentKey._id
                            },
                            data: result
                        }

                        s.emit(q.event, response)
                    }
                })
                    
            })                

        // Added nastiness for queries that watch OTHER models as well...
        //q.sensitivityList.map(other => {
        //})

        }
    })
})

async function subscribeSessionToQuery(
    socket: SocketIO.Socket,
    query: EventToQueryResponseBinding<any>,
    eventPayload: any) {

    let appContext = {
        user: socket.handshake.session.user,
        eventPayload: eventPayload
    }

    const result = await query.exec(appContext)

    if (result) {
        const response = {
            apimeta: {
                scope: 'none',
                query: query.event
            },
            data: result
        }

        socket.emit(query.event, response)
    }

    socket.join(query.event)
}

io.on('connection', async socket => {

    modelSubscriptions.map(m => {
        m.queries.map(q => {
            socket.on(q.event, async function(eventPayload: any) {

                if (socket.handshake.session.user)
                    await subscribeSessionToQuery(socket, q, eventPayload)

                else if (eventPayload && typeof(eventPayload.sid) == 'string')
                    firebaseAdminRef.auth().verifyIdToken(eventPayload.sid)
                        .then(async (decoded: any) => {
                            const user = await User.findOne({ email: { $eq: decoded.email }})
                            
                            socket.handshake.session.user = {
                                _id: user._id,
                                email: decoded.email
                            }

			    socket.handshake.session.save(() => {})

                            await subscribeSessionToQuery(socket, q, eventPayload)
                        })
            })
        })
    })
/*
    socket.off('user-id', console.log)

    // Should accept EITHER subscriber or payload
    socket.on('user-id', async (subscriber: any) => {

        if (subscriber && typeof(subscriber.sid) == 'string')
            firebaseAdminRef.auth().verifyIdToken(subscriber.sid)
                .then(async (decoded: any) => {

                    const user = await User.findOne({ email: decoded.email })
                    console.log(user)

                    const response = {
                        apimeta: {
                            scope: 'none',
                            query: 'user-id',
                            _id: user._id
                        },
                        data: user
                    }
                    
                    socket.emit('user-id', response)

                    socket.handshake.session.user = user
                    socket.handshake.session.save()
                })
        else
            socket.emit('user-id', null)
    })

    socket.on('user', async (e: any) => {
        const user = await User.findById(e.user._id)

        Object.assign(user, e.user)

        await user.save()
    })
*/

})



if (prod)
{
console.log('starting prod server')
server.listen(port)
}
else
    server.listen(port, '127.0.0.1')
