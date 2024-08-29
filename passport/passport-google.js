'use strict';

const passport = require('passport');
const User = require('../models/users');
const secret = require('../secret/appSecret');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

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


passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true

}, (req, accessToken, refreshToken, profile, done) =>
{
    // console.log('in google', profile);
    User.findOne({ google: profile.id }).then((user) =>
    {
        console.log({ user });
        if (user)
        {

            return done(null, user);
        } else
        {
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullName = profile.displayName;
            newUser.username = profile.displayName;
            newUser.firstName = profile.name.givenName;
            newUser.lastName = profile.name.familyName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile.photos[0].value;
            // newUser.fbTokens.push({token})

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
