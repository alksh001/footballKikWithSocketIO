'use strict';

module.exports = function (_, passport, User)
{

    return {
        SetRouting: function (router)
        {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getgoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignup)
        },

        indexPage: function (req, res)
        {
            const errors = req.flash('error');
            return res.render('index', { title: "Football | Login", messages: errors, hasErrors: errors.length > 0 })
        },


        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function (req, res)
        {
            const errors = req.flash('error');
            return res.render('signup', { title: "Football | Signup", messages: errors, hasErrors: errors.length > 0 });
        },

        postSignup: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'public_profile'
        }),

        getgoogleLogin: passport.authenticate('google', {
            scope: ['openid', 'email']
        }),

        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),


    }
} 