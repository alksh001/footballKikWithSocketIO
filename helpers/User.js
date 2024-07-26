// 'use strict'

// module.exports = function ()
// {
//     return {
//         SignUpValidation: (req, res, next) =>
//         {
//             console.log({req});
//             req.body('username', 'Username is required').notEmpty();
//             req.body('username', 'Username must not less than 3').isLength({ min: 3 });
//             req.body('email', 'Email is required').notEmpty();
//             req.body('email', 'Email is invalid').isEmail();
//             req.body('password', 'Password is required').notEmpty();
//             req.body('password', 'Password must not less than 5').isLength({ min: 5 });

//             req.getValidationResult()
//                 .then(result =>
//                 {
//                     const errors = result.array();
//                     const messages = [];
//                     errors.forEach(error =>
//                     {
//                         messages.push(error.msg)
//                     });

//                     req.flash('error', messages);
//                     res.redirect('/signup')
//                 })
//                 .catch(err =>
//                 {
//                     return next();
//                 });
            
//         }
//     }
// }


'use strict'

const { body, validationResult } = require('express-validator');

module.exports = function() {
    return {
        SignUpValidation: [
            body('username')
                .notEmpty().withMessage('Username is required')
                .isLength({ min: 3 }).withMessage('Username must not be less than 3 characters'),
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid'),
            body('password')
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 5 }).withMessage('Password must not be less than 5 characters'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const messages = errors.array().map(error => error.msg);
                    req.flash('error', messages);
                    return res.render('signup', {
                        hasErrors: true,
                        messages
                    })
                    // return res.redirect('/signup');
                }
                next();
            }
        ],

         LoginValidation: [
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid'),
            body('password')
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 5 }).withMessage('Password must not be less than 5 characters'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const messages = errors.array().map(error => error.msg);
                    req.flash('error', messages);
                    return res.render('index', {
                        hasErrors: true,
                        messages
                    })
                    // return res.redirect('/signup');
                }
                next();
            }
        ]
    }
}
