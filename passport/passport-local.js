'use strict';

const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) =>
{
    done(null, user.id)
});

passport.deserializeUser((id, done) =>
{
    User.findById(id).then(user =>
    {
        done(null, user);
    }).catch(err =>
    {
        if (err)
        {
            return done(err);
        }
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) =>
{
    User.findOne({ 'email': email }).then((user) =>
    {

        if (user)
        {
            console.log({ user });
            return done(null, false, req.flash('error', 'That email is already taken.'));
        } else
        {
            const newUser = new User();
            newUser.username = req.body.username;
            newUser.fullName = req.body.username;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password); // Ensure you have a method to hash the password

            newUser.save().then(() =>
            {
                done(null, newUser);
            });
        }
    }).catch(err =>
    {
        if (err)
        {
            return done(err);
        }
    })
}));



passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) =>
{
    User.findOne({ 'email': email }).then((user) =>
    {
        let messages = [];
        if (!user || !user.validateUssrPassword(password))
        {
            messages.push('Email or Password is invalid');
            return done(null, false, req.flash('error', messages))
        }

        return done(null, user);
    }).catch(err =>
    {
        if (err)
        {
            return done(err);
        }
    })
}));