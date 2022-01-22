const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, 'Please Enter a name'],
    },

    avatar: {
        public_id: String,
        url: String,
    },

    email: {
        type: String,
        required: [true, 'Please Enter a email'],
        unique: [true, 'Please Enter a unique email'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter a password'],
        minlength: [6, 'Please Enter a min 6 digit password'],
        select: false,
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
} );

userSchema.pre( 'save', async function ( next ) {
    if ( this.isModified( 'password' ) ) {
        this.password = await bcrypt.hash( this.password, 10 );
    }
    next();
} );

userSchema.methods.matchPassword = async function ( password ) {
    return await bcrypt.compare( password, this.password );
}

userSchema.methods.generateToken = function () {
    
    return jwt.sign( { _id: this._id }, process.env.JWT_SECRET );

}

module.exports = mongoose.model( 'User', userSchema );
