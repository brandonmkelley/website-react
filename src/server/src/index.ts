
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

var firebaseAdmin = require('firebase-admin');

var firebaseAdminRef = firebaseAdmin.initializeApp({
credential: firebaseAdmin.credential.cert('./static/firebaseServiceAccount.json'),
    databaseURL: 'https://userportal-fa7ab.firebaseio.com'
  }, 'ADMIN');

import User, { IUser } from './models/User'
import Subject from './models/Subject'
import Message, { IMessage } from './models/Message'
import { ChangeEventUpdate, ObjectID } from "mongodb"

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
    
    socket.off('user-id', console.log)

    // Should accept EITHER subscriber or payload
    socket.on('user-id', async (subscriber: any) => {
        //console.log(subscriber)

        if (subscriber && subscriber.sid)
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

    socket.on('chat-id-user-all-view', async (subscriber: any) => {
        // Experiment with SQL-like aggregate queries in MongoDB/Mongoose.

        if (subscriber && subscriber.sid)
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

                    /*
                    const chatUserPipeline = Message.aggregate()
                        .unwind('recipientUserID')
                        .match({ '$or': [
                            { 'fromUserID': { '$eq': user._id } },
                            { 'recipientUserID': { '$eq': user._id } }
                        ]})
                        .group({
                            _id: '$fromUserID',
                            sendDt: { '$max': '$sentDt' }
                        })
                        .lookup({
                            from: 'messages',
                            let: {
                                'fromUserID': '$fromUserID',
                                'sentDt': '$sentDt'
                            },
                            pipeline: [
                                { $match:
                                   { $expr:
                                      { $and:
                                         [
                                           { $eq: [ "$fromUserID",  "$$fromUserID" ] },
                                           { $gte: [ "$sentDt", "$$sentDt" ] }
                                         ]
                                      }
                                   }
                                },
                                { $project: { fromUserID: 0, sentDt: 0 } }
                             ],
                             as: 'latestMessage'
                        })
                        .pipeline()
*/

/*

                    const fromUserPipeline = Message.aggregate()
                        .unwind('recipientUserID')
                        .match({ 'fromUserID': user._id })
                        .addFields({ 'otherUserID': '$recipientUserID' })
                        .pipeline()

                    const toUserPipeline = Message.aggregate()
                        .unwind('recipientUserID')
                        .match({ 'recipientUserID': user._id })
                        .addFields({ 'otherUserID': '$fromUserID' })
                        .pipeline()

                    const allUserMessagePipeline = Message.aggregate()
                        .append({
                            $facet: {
                                fromUserMessages: fromUserPipeline,
                                toUserMessages: toUserPipeline
                            }
                        })
                        .addFields({
                            message: {
                                $concatArrays: [ '$fromUserMessages', '$toUserMessages' ]
                            }
                        })
                        .unwind('message')
                        .pipeline()

                    const lookupMessageByUserDatePipeline =
                        Message.aggregate(allUserMessagePipeline)
                            .match({ $expr: { $and: [
                                    { $eq: [ '$message.involvedUserID', '$$involvedUserID' ] },
                                    { $eq: [ '$message.sentDt', '$$sentDt' ] }
                                ] } })
                            .pipeline()

                    const chatUserPipeline = Message.aggregate(allUserMessagePipeline)
                        .group({
                            _id: '$message.otherUserID',
                            sentDt: { $max: '$message.sentDt' }
                        })
                        .lookup({
                            from: 'messages',
                            let: { 
                                involvedUserID: '$_id',
                                sentDt: '$sentDt'
                            },
                            pipeline: lookupMessageByUserDatePipeline,
                            as: 'message'
                        })
                        .unwind('message')
                        .pipeline()
*/

                    

/*
                    const allMessagesPipeline = Message.aggregate().pipeline()

                    const chatUserPipeline = Message.aggregate()
                        //.group({ _id: '$fromUserID', messages: { $push: '$$ROOT' } })
                        .replaceRoot({ $arrayToObject: [ [ {
                            k: { $concat: [{ $toString: '$_id' }, { $toString: '$fromUserID' }] },
                            v: '$$ROOT'
                        } ] ] })
                        .group({ _id: 'fromMessages', fromMessages: { $push: '$$ROOT' } })
                        .addFields({ 'fromMessageMap': { $mergeObjects: '$fromMessages' } })
                        .lookup({
                            from: 'messages',
                            pipeline: allMessagesPipeline,
                            as: 'toMessage'
                        })
                        .unwind('toMessage')
                        .unwind('toMessage.recipientUserID')
                        .addFields({ 'toMessageMap': { $arrayToObject: [ [ {
                            k: { $concat: [{ $toString: '$toMessage._id' }, { $toString: '$toMessage.recipientUserID' }] },
                            v: '$$ROOT'
                        } ] ] } })
                        .group({
                            _id: 'allMessages',
                            toMessages: { $push: '$toMessageMap' },
                            fromMessages: { $first: '$fromMessageMap' }
                        })
                        .addFields({ 'toMessageMap': { $mergeObjects: '$toMessages' }})
                        .addFields({ allMessageMap: { $mergeObjects: [ '$toMessageMap', '$fromMessageMap' ]}})
                        //.group({ _id: 'involvedUsers', IDs: { $push: '$$ROOT' } })
                        //.replaceRoot({ 'involvedUsers': { $arrayToObject: [ [ { k: { $toString: '$fromUserID' }, v: '$recipientUserID' } ] ] }
                        //)
                        //.replaceRoot({ $mergeObjects: '$$ROOT' })
                        
                        .project({
                            'involvedUserID': '$fromUserID',
                            'otherUsers': '$recipientUserID'
                        })
                        .replaceRoot({ 'newRoot': {
                                '$mergeObjects': [
                                    { 'involvedUsers': '$$ROOT' },
                                    { 'involvedUsers': { '$map': {
                                        input: '$otherUsers',
                                        as: 'otherUser',
                                        in: { 'involvedUserID': '$otherUser' }
                                    } } }
                                ]
                            } })
                            
                        .pipeline()
*/
                })

        else
            socket.emit('chat-id-user-all-view', null)

    })
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
