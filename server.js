const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
// const {body, validationResult} = require('express-validator')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const User = require('./models/users');
const { Users } = require('./helpers/UsersClass');

const container = require('./container');


container.resolve(function (users, _, admin, home, group)
{

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://127.0.0.1:27017/footballkik')
        .then(async () =>
        {
            console.log("DB connected");
            await User.collection.dropIndex('fullName_1').catch(err =>
            {
                if (err.codeName !== 'IndexNotFound')
                {
                    throw err;
                }
            });
        }).catch(err =>
        {
            console.log('mongoerr', err);
        });

    const app = SetupExpress();

    function SetupExpress()
    {
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(3000, function ()
        {
            console.log('Listening on 3000');
        });

        ConfigureExpress(app);
        require('./socket/groupchat')(io, Users)

        const router = require('express-promise-router')(); // Call the function to create a new router instance


        if (users && typeof users.SetRouting === 'function')
        {

            users.SetRouting(router);
            admin.SetRouting(router);
            home.SetRouting(router)
            group.SetRouting(router)
            app.use(router);

        } else
        {
            console.error('Error: users.SetRouting is not a function or users module not resolved properly');
        }
        return app;
    }


    function ConfigureExpress(app)
    {

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // app.use((req, res, next) =>
        // {
        //     validationResult(req);
        //     next();
        // });

        app.use(session({
            secret: 'thisisasecret',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: 'mongodb://127.0.0.1:27017/footballkik',
                ttl: 14 * 24 * 60 * 60 // 14 days
            })
        }));
        // app.use(session({
        //     secret: 'thisisasecret',
        //     resave: false,
        //     saveUninitialized: false,
        //     store: new MongoStore({ mongooseConnection: mongoose.connection })
        // }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        // To set global variables we can do is like
        app.locals._ = _;
    }

});




