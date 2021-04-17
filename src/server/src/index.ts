
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

const modelSubscriptions = [ userModel, subjectModel, messageModel ]

const User = userModel.model
const Message = messageModel.model

type IUser = userModel.IUser

modelSubscriptions.map(m => {
    m.queries.map(q => {
        m.model.watch().on('change',
            async _ => io.to(q.event).emit(q.event, await q.query(true)))
    })
})

io.on('connection', socket => {

    modelSubscriptions.map(m => {
        m.queries.map(q => {
            socket.on(q.event, async function() {
                const result = await q.query(true)
                socket.emit(q.event, result)

                socket.join(q.event)
            })
        })
    })

    socket.off('user-id', console.log)

    // Should accept EITHER subscriber or payload
    socket.on('user-id', async (subscriber: any) => {
        //console.log(subscriber)

        if (subscriber && typeof(subscriber.sid) == 'string')
            firebaseAdminRef.auth().verifyIdToken(subscriber.sid)
                .then(async (decoded: any) => {
                    //console.log(decoded)

                    socket.emit('user-id', await User.findOne({ email: decoded.email }))

                    const userIdPipeline = User.aggregate()
                        .match({ 'fullDocument.email': decoded.email })
                        .match({ 'operationType': { '$in': ['update'] } })
                        .pipeline()

                    User.watch(userIdPipeline, { 'fullDocument': 'updateLookup' })
                        .on('change', (e: ChangeEventUpdate<mongoose.Model<IUser>>) => io.emit('user-id', e.fullDocument))
                })
        else
            socket.emit('user-id', null)
    })

    socket.on('user', async (e: any) => {
        const user = await User.findById(e.user._id)

        Object.assign(user, e.user)

        await user.save()
    })

    socket.on('chat-view', async (subscriber: any) => {
        // Experiment with SQL-like aggregate queries in MongoDB/Mongoose.

        if (subscriber && typeof(subscriber.sid) == 'string')
            firebaseAdminRef.auth().verifyIdToken(subscriber.sid)
                .then(async (decoded: any) => {

                    const user = await User.findOne({ email: decoded.email })

                    const chatMessagePipeline = Message.aggregate()
                        .unwind('recipientUserID')
                        .match({ $expr: { $or: [
                                { $eq: [ '$fromUserID', user._id ] },
                                { $eq: [ '$recipientUserID', user._id ] }
                            ] } })
                        .addFields({ 'otherUserID': {
                            $cond: {
                                if: { $eq: [ '$fromUserID', user._id ] },
                                then: '$recipientUserID',
                                else: '$fromUserID'
                            } } })
                        .pipeline()

                    const chatUserPipeline = Message.aggregate(chatMessagePipeline)
                        .group({ _id: '$otherUserID', sentDt: { $max: '$sentDt' } })
                        .lookup({
                            from: 'messages',
                            let: { otherUserID: '$_id', sentDt: '$sentDt' },
                            pipeline: Message.aggregate(chatMessagePipeline)
                                .match({ $expr: { $and: [
                                    { $eq: [ '$otherUserID', '$$otherUserID' ] },
                                    { $eq: [ '$sentDt', '$$sentDt' ] }
                                ]}})
                                .limit(1)
                                .pipeline(),
                            as: 'message'
                        })
                        .unwind('message')
                        .replaceRoot('$message')
                        .pipeline()

                    Message.watch(
                        Message.aggregate()
                            .match({ $expr: { $or: [
                                { $eq: [ '$fullDocument.fromUserID', user._id ] },
                                { $in: [ user._id, '$fullDocument.recipientUserID' ] }
                            ]}})
                            .pipeline()
                        , { 'fullDocument': 'updateLookup' })
                        .on('change', (e: any) => io.emit('chat-id-user-all-view', e.fullDocument))

                    Message.aggregate(chatUserPipeline)
                        .exec((err, result) => {
                            if (err) {
                                console.log(err)

                                io.emit('error', {
                                    type: 'chat-id-user-all-view',
                                    result: err
                                })
                            }

                            else
                                io.emit('chat-id-user-all-view', result)
                        })
                })

        else
            socket.emit('chat-view', null)

    })
})



if (prod)
    server.listen(port)
else
    server.listen(port, '127.0.0.1')
