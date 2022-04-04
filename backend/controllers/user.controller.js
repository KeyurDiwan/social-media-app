const Post = require( '../models/post.model' );
const User = require( '../models/user.model' );
const { sendEmail } = require( "../middlewares/sendEmail" );
const crypto = require( 'crypto' );
const cloudinary = require("cloudinary");

exports.register = async ( req, res ) => {
    try {
        const { name, email, password, avatar } = req.body;

        let user = await User.findOne( { email } );
        if ( user ) {
            return res
                .status( 400 )
                .json( { success: false, message: "User already exists" } );
        }

        const myCloud = await cloudinary.v2.uploader.upload( avatar, {
            folder: "avatars",
        } );

        user = await User.create( {
            name,
            email,
            password,
            avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
        } );

        const token = await user.generateToken();

        const options = {
            expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 ),
            httpOnly: true,
        };

        res.status( 201 ).cookie( "token", token, options ).json( {
            success: true,
            user,
            token,
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        } );
    }
};

exports.login = async ( req, res ) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne( { email } ).select( "+password" );
        
        if ( !user ) {
            return res.status( 400 ).json( {
                success: false,
                message: "user does not exist.",
            } );
        }

        const isMatch = await user.matchPassword( password );
        
        if ( !isMatch ) {
            return res.status( 400 ).json( {
                success: false,
                message: 'Password is wrong',
            } );
        }

        const token = await user.generateToken();

        const options = {
            expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 ),
            httpOnly: true,
        };

        res.status( 200 ).cookie( 'token', token, options )
            .json( {
                success: true,
                user,
                token,
            } );

    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        } )
    }
};

exports.logout = async ( req, res ) => {
    try {
        
        res.status( 200 ).cookie( 'token', null, { expires: new Date( Date.now() ), httpOnly: true } )
            .json( {
                success: true,
                message: "Logout success..!!"
            } )

    } catch (error) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } );
    }
}

exports.followUser = async ( req, res ) => {
    try {

        const userToFollow = await User.findById( req.params.id );
        const loggedInUser = await User.findById( req.user._id );

        if( !userToFollow ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'User not found',
            } );
        }

        if ( loggedInUser.following.includes( userToFollow._id ) ) {
            
            const indexFollowing = loggedInUser.following.indexOf( userToFollow._id );
            const indexFollowers = userToFollow.followers.indexOf( loggedInUser._id );
            
            loggedInUser.following.splice( indexFollowing, 1 );
            userToFollow.followers.splice( indexFollowers, 1 );

            await loggedInUser.save();
            await userToFollow.save(); 

             res.status( 200 ).json( {
                success: true,
                message: 'User to Unfollow was successfully'
            } );

        } else {
        loggedInUser.following.push( userToFollow._id );
        userToFollow.followers.push( loggedInUser._id );
        
        await loggedInUser.save();
        await userToFollow.save();

            res.status( 200 ).json( {
                success: true,
                message: 'User to follow was successfully'
            } );
        }

     

        
    } catch (error) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        })
    }
}

exports.updatePassword = async ( req, res ) => {
    try {

        const user = await User.findById( req.user._id ).select('+password');

        const { oldPassword, newPassword } = req.body;

        if ( !oldPassword || !newPassword ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Please Privide old and new password..!!"
            })
        }

        const isMatch = await user.matchPassword( oldPassword );

        if ( !isMatch ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Incorrect Old Password"
            } );
        }

        user.password = newPassword;
        await user.save();

        res.status( 200 ).json( {
            success: true,
            message: "Password Updated successfully..!!",
        } )
        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        } )
    }
}

exports.updateProfile = async ( req, res ) => {
    try {
        const user = await User.findById( req.user._id );

        const { name, email, avatar } = req.body;

        if ( name ) {
            user.name = name;
        }
        if ( email ) {
            user.email = email;
        }

        if ( avatar ) {
            await cloudinary.v2.uploader.destroy( user.avatar.public_id );

            const myCloud = await cloudinary.v2.uploader.upload( avatar, {
                folder: "avatars",
            } );
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        await user.save();

        res.status( 200 ).json( {
            success: true,
            message: "Profile Updated",
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        } );
    }
};



exports.deleteMyProfile = async ( req, res ) => {
    try {
        const user = await User.findById( req.user._id );
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        // Removing Avatar from cloudinary
        await cloudinary.v2.uploader.destroy( user.avatar.public_id );

        await user.remove();

        // Logout user after deleting profile

        res.cookie( "token", null, {
            expires: new Date( Date.now() ),
            httpOnly: true,
        } );

        // Delete all posts of the user
        for ( let i = 0; i < posts.length; i++ ) {
            const post = await Post.findById( posts[i] );
            await cloudinary.v2.uploader.destroy( post.image.public_id );
            await post.remove();
        }

        // Removing User from Followers Following
        for ( let i = 0; i < followers.length; i++ ) {
            const follower = await User.findById( followers[i] );

            const index = follower.following.indexOf( userId );
            follower.following.splice( index, 1 );
            await follower.save();
        }

        // Removing User from Following's Followers
        for ( let i = 0; i < following.length; i++ ) {
            const follows = await User.findById( following[i] );

            const index = follows.followers.indexOf( userId );
            follows.followers.splice( index, 1 );
            await follows.save();
        }

        // removing all comments of the user from all posts
        const allPosts = await Post.find();

        for ( let i = 0; i < allPosts.length; i++ ) {
            const post = await Post.findById( allPosts[i]._id );

            for ( let j = 0; j < post.comments.length; j++ ) {
                if ( post.comments[j].user === userId ) {
                    post.comments.splice( j, 1 );
                }
            }
            await post.save();
        }
        // removing all likes of the user from all posts

        for ( let i = 0; i < allPosts.length; i++ ) {
            const post = await Post.findById( allPosts[i]._id );

            for ( let j = 0; j < post.likes.length; j++ ) {
                if ( post.likes[j] === userId ) {
                    post.likes.splice( j, 1 );
                }
            }
            await post.save();
        }

        res.status( 200 ).json( {
            success: true,
            message: "Profile Deleted",
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        } );
    }
};


exports.myProfile = async ( req, res ) => {
    try {

        const user = await User.findById( req.user._id ).populate(
            "posts followers following" );

        res.status( 200 ).json( {
            success: true,
            user
        } )
        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
}


exports.getUserProfile = async ( req, res ) => {
    try {

        const user = await User.findById( req.params.id ).populate(
            'posts followers following' );

        if ( !user ) {
            return res.status( 404 ).json( {
                success: false,
                message: "User noot found..!!"
            } )
        }
        res.status( 200 ).json( {
            success: true,
            user,
        } )
        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
}

exports.getAllUsers = async ( req, res ) => {
    try {

        const users = await User.find( {} );

        res.status( 200 ).json( {
            sucess: true,
            users,
        } );

        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
};

exports.forgotPassword = async ( req, res ) => {

    try {

        const user = await User.findOne( { email: req.body.email } );

        if ( !user ) {
            return res.status( 404 ).json( {
                success: false,
                message: "User not found..!!"
            } );

        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${ req.protocol }://${ req.get( 'host' ) }/api/v1/Password/reset/${ resetPasswordToken }`;
        
        const message = `You are receiving this email because you ( or someone else ) has requested the reset of a password. Please make a PUT request to: ${ resetUrl }`;

        try {

     
            await sendEmail( {
                email: user.email,
                subject: "Password reset token",
                message,
            } );

            res.status( 200 ).json( {
                success: true,
                message: `Email sent to ${ user.email }..!`,
            } );

        } catch ( error ) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            res.status( 500 ).json( {
                success: false,
                message: error.message, // here i faced error..!!
            } );
        }


    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
};

exports.resetPassword = async ( req, res ) => {

    try {

        const resetPasswordToken = crypto.createHash( 'sha256' )
            .update( req.params.token )
            .digest( 'hex' );
        
        const user = await User.findOne( {
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        } );

        if ( !user ) {
            return res.status( 401 ).json( {
                success: false,
                message: "Password reset token is invalid or has expired..!!"
            } );
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status( 200 ).json( {
            success: true,
            message: "Password reset successfully..!!"
        } );

    } catch ( error ) {

    }
}


exports.getMyPosts = async ( req, res ) => {
    try {

        const user = await User.findById( req.user._id );

        const posts = [];


        for ( let i = 0; i < user.posts.length; i++ ) {
        
            const post = await Post.findById( user.posts[i] ).populate(
                'likes comments.user owner' )
            posts.push( post );
        }

        res.status( 200 ).json( {
            sucess: true,
            posts,
        } );

        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
};
