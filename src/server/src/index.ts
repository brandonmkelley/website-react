
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
    	key: fs.readFileSync('./static/private.key'),
        cert: fs.readFileSync('./static/certificate.crt'),
        ca: fs.readFileSync('./static/ca_bundle.crt')
    }
    
    server = createHTTPSServer(httpsOptions, app)
    port = 4430
}

else {
    server = createHTTPServer(app)
    port = 8080
}

// Read -s argument if static files need to be served (prod only.)
var argStart = 0;

do {
    pathIndex = process.argv.indexOf('-s', argStart)

    if (pathIndex !== -1 && process.argv.length > pathIndex + 1) {
        var staticPath = process.argv[pathIndex + 1]
        console.log('Loading static files from path: ' + staticPath)
        app.use('/static', express.static(staticPath))
    }

    argStart = pathIndex + 1;
}
while (argStart && argStart < process.argv.length)

import * as socketio from 'socket.io'
const io = socketio(server)

import * as mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/flexworks?replicaSet=rs0', { useNewUrlParser: true, useUnifiedTopology: true })



/*
const userSchema = new mongoose.Schema({
    email: String
})

const User = mongoose.model('users', userSchema)

const subjectSchema = new mongoose.Schema({
    id: Number,
    name: String,
    createdDt: String,
    createdUser: String
})

const Subject = mongoose.model('subjects', subjectSchema)
*/

const db = mongoose.connection

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

db.on('error', console.error.bind(console, 'Mongo connection error:'))

//User.watch().on('change', console.log)


import User from './models/User'
import Subject from './models/Subject'
import Message from './models/Message'

function mapDBRowsToDictionary(rows: any[]) : any {
    return rows.reduce((r, i) => {
        r[i.id] = i
        return r
    }, {})
}

User.watch().on('change', async _ =>
    io.emit('user-all', mapDBRowsToDictionary(await User.find({}))))

Subject.watch().on('change', async _ =>
    io.emit('subject-all', mapDBRowsToDictionary(await Subject.find({}))))

Message.watch().on('change', async _ =>
    io.emit('message-all', mapDBRowsToDictionary(await Message.find({}))))

io.on('connection', (socket: any) => {
    socket.on('user-all', async _ =>
        io.emit('user-all', mapDBRowsToDictionary(await User.find({}))))

    socket.on('subject-all', async _ =>
        io.emit('subject-all', mapDBRowsToDictionary(await Subject.find({}))))

    socket.on('message-all', async _ =>
        io.emit('message-all', mapDBRowsToDictionary(await Message.find({}))))
})

// User.find((err: any, users: any) => console.log(users))

/*
// Test connection
db.once('open', function() {
  // we're connected!
    console.log('connected')

    User.find((err: any, users: any) => console.log(users))

    User.watch().on('change', console.log)
});
*/

var firebaseAdmin = require('firebase-admin');

var firebaseAdminRef = firebaseAdmin.initializeApp({
credential: firebaseAdmin.credential.cert('./static/firebaseServiceAccount.json'),
    databaseURL: 'https://userportal-fa7ab.firebaseio.com'
  }, 'ADMIN');

io.on('connection', (socket: any) => {
/*
    socket.on('write-user', (user: any) =>
        User.findById(user._id, (err: any, doc: mongoose.Document) => {
            doc.set('email', user.email)
            doc.save()
        }))
*/

/*
    socket.on('read-page-app', (context) => {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(decoded => {
                    //console.log(decoded)

                    User.find((err: any, users: any) => socket.emit('read-user-list', users))
                })
        else
            socket.emit('read-user-list', [])
    })
    */

    // Legacy: create user in Firebase auth syncing from client back to MongoDB.
    /*
    socket.on('insert-user', (context) => {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(decoded => {
                    User.create({ email: context.email }, (err, _) => {
                        // Definitely replace this with a change stream listener.
                        User.find((err: any, users: any) => socket.broadcast.emit('read-user-list', users))
                    })
                })
    })
    */

    //socket.on('patch-user')

    /*
    socket.on('delete-user', (context) => {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(decoded => {
		// User.findOneAndRemove({ email: context.email }, () => {
                        // Definitely replace this with a change stream listener.
			//        User.find((err: any, users: any) => socket.broadcast.emit('read-user-list', users))
			// })
                })
    })
    */
})

app.get('/api/trigger-subject-all', (req, res) => {
    io.emit('subject-all', {
        "1": {
            "name": "This is NEW thread 1",
            "createdDt": "2021-02-01T00:00:00.000Z",
            "createdUser": "1"
        },
        "2": {
            "name": "This is NEW thread 2",
            "createdDt": "2021-02-05T00:00:00.000Z",
            "createdUser": "2"
        }
    })

    res.end('trigger on subject-all successful.')
})



if (prod)
    server.listen(port)
else
    server.listen(port, '127.0.0.1')
