const User = require( '../models/user.model' );

exports.register = async ( req, res ) => {
    try {
        
        const { name, email, password } = req.body;

        let user = await User.findOne( { email } );
        if ( user ) {
            return res.status( 400 )
                .json( {
                    success: false, message: "user already exists"
                } );
        }

        user = await User.create( {
            name, email, password, avatar: {
                public_id: 'sample_id',
                url: 'sample_url'
            }
        } );
        // res.status( 201 ).json( { success: true, user } );

        const token = await user.generateToken();

        const options = {
            expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 ),
            httpOnly: true,
        };

        res.status( 201 ).cookie( 'token', token, options)
            .json( {
            success: true,
            user,
            token,
        } );

    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
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
        })

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

        const { name, email } = req.body;

        if ( name ) {
            user.name = name;
        }
        if ( email ) {
            user.email = email;
        }

        // Useravatar TODO

        await user.save();

        res.status( 200 ).json( {
            success: true,
            message: "profile Updated..!"
        })
         
    } catch (error) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
        })
    }
}
