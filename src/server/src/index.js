"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var http_1 = require("http");
var https_1 = require("https");
var fs = require("fs");
// Read -p argument to deploy prod
var server = null;
var port = null;
var pathIndex = process.argv.indexOf('-p');
var prod = pathIndex !== -1;
if (prod) {
    var httpsOptions = {
        key: fs.readFileSync('./static/private.key'),
        cert: fs.readFileSync('./static/certificate.crt'),
        ca: fs.readFileSync('./static/ca_bundle.crt')
    };
    server = https_1.createServer(httpsOptions, app);
    port = 4430;
}
else {
    server = http_1.createServer(app);
    port = 8080;
}
// Read -s argument if static files need to be served (prod only.)
var argStart = 0;
do {
    pathIndex = process.argv.indexOf('-s', argStart);
    if (pathIndex !== -1 && process.argv.length > pathIndex + 1) {
        var staticPath = process.argv[pathIndex + 1];
        console.log('Loading static files from path: ' + staticPath);
        app.use(express.static(staticPath));
    }
    argStart = pathIndex + 1;
} while (argStart && argStart < process.argv.length);
var socketio = require("socket.io");
var io = socketio(server);
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/uniq?replicaSet=rs0', { useNewUrlParser: true, useUnifiedTopology: true });
var userSchema = new mongoose.Schema({
    email: String
});
var User = mongoose.model('users', userSchema);
var db = mongoose.connection;
var expressSession = require("express-session");
var socketSession = require("express-socket.io-session");
var mongoSession = require("connect-mongo");
var mongoStore = mongoSession(expressSession);
var appSession = expressSession({
    store: new mongoStore({
        mongooseConnection: db
    }),
    secret: 'foo',
    resave: true,
    saveUninitialized: true
});
app.use(appSession);
io.use(socketSession(appSession));
db.on('error', console.error.bind(console, 'Mongo connection error:'));
User.watch().on('change', console.log);
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
io.on('connection', function (socket) {
    /*
        socket.on('write-user', (user: any) =>
            User.findById(user._id, (err: any, doc: mongoose.Document) => {
                doc.set('email', user.email)
                doc.save()
            }))
    */
    socket.on('read-page-app', function (context) {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(function (decoded) {
                //console.log(decoded)
                User.find(function (err, users) { return socket.emit('read-user-list', users); });
            });
        else
            socket.emit('read-user-list', []);
    });
    socket.on('insert-user', function (context) {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(function (decoded) {
                User.create({ email: context.email }, function (err, _) {
                    // Definitely replace this with a change stream listener.
                    User.find(function (err, users) { return socket.broadcast.emit('read-user-list', users); });
                });
            });
    });
    //socket.on('patch-user')
    socket.on('delete-user', function (context) {
        if (context && context.sid)
            firebaseAdminRef.auth().verifyIdToken(context.sid)
                .then(function (decoded) {
                // User.findOneAndRemove({ email: context.email }, () => {
                // Definitely replace this with a change stream listener.
                //        User.find((err: any, users: any) => socket.broadcast.emit('read-user-list', users))
                // })
            });
    });
});
app.get('trigger-subject-all', function (req, res) {
    /*
    req.socket.emit('subject-all', {
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
    */
    res.end('trigger successful.');
});
if (prod)
    server.listen(port);
else
    server.listen(port, '127.0.0.1');
