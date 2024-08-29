'use strict';

const passport = require('passport');
const User = require('../models/users');
const secret = require('../secret/appSecret');
const FacebookStrategy = require('passport-facebook').Strategy;

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


passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true

}, (req, token, refreshToken, profile, done) =>
{
    User.findOne({ facebook: profile.id }).then((user) =>
    {
        if (user)
        {
            return done(null, user);
        } else
        {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullName = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'http://graph.facebook.com/' + profile.id + '/picture?type=large';
            newUser.fbTokens.push({ token })

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
