const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

const userSchema = mongoose.Schema({
    username: { type: String, default: "" },
    fullName: { type: String, default: "" },
    email: { type: String, unique: true },
    password: { type: String, default: "" },
    userImage: { type: String, default: 'default.png' },
    facebook: { type: String, default: "" },
    fbTokens: Array,
    google: { type: String, default: "" },
    sentRequest: [{
        username: { type: String, default: "" }
    }],
    request: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, default: "" }
    }]
    // googleTokens: Array,
});

userSchema.methods.encryptPassword = function (password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
};

userSchema.methods.validateUssrPassword = function (password)
{
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", userSchema);