const { json } = require( 'express/lib/response' );
const Post = require( '../models/post.model' );
const User = require( '../models/user.model' );
exports.createPost = async ( req, res, next ) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public: "req.body.public_id",
                url: "req.body.url",
            },
            owner: req.user._id,
           
        }
         console.log( newPostData.owner )
        const post = await Post.create( newPostData );

        const user = await User.findById( req.user._id );

        user.posts.push( post._id );

        await user.save();
        
        res.status( 201 ).json( {
            success: true,
            post,
        } );


    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
};

exports.deletePost = async ( req, res ) => {
    try {
        
        const post = await Post.findById( req.params.id );
     
        if ( !post ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'No such post',
            } )
        }
       
        if ( post.owner.toString() !== req.user._id.toString() ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'You are not allowed to access this',
            } )
        }

        await post.remove();

        const user = await User.findById( req.user._id );
        
        const index = user.posts.indexOf( req.params.id );
        user.posts.splice( index, 1 );
        await user.save();

        res.status( 200 ).json( {
            success: true,
            message: 'Success!',
        } );

    } catch (error) {
        res.status( 500 ).json( {
            success: false,
            message: error.message,
       }) 
    }
}

exports.likeAndUnlikePost = async ( req, res ) => {
    try {

        const post = await Post.findById( req.params.id );

        if ( !post ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'No post found',
            } );
        }

        if ( post.likes.includes( req.user._id ) ) {
          
            const index = post.likes.indexOf( req.user._id );
            post.likes.splice( index, 1 );

            await post.save();

            return res.status( 200 ).json( {
                success: true,
                message: "Post unLiked",
            } );
        } else {
            post.likes.push( req.user._id );

            await post.save();

            return res.status( 200 ).json( {
                success: true,
                message: " Post Liked..! "
            } )
        }
        
       
        
    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }


}




// exports.getPostOfFollowing = async ( req, res ) => {
    
//     try {

//         const user = await User.findById( req.user._id );
//         user.following;

//         const posts = await Post.find( {
//             owner: {
//                 $in: user.following
//             }
//         } ).populate( 'owner likes comments.user' )

//         res.status( 200 ).json( {
//             success: true,
//             posts:posts.reverse(),
            
//         } )
        
//     } catch ( error ) {
//         res.status( 500 ).json( {
//             success: false,
//             message: error.message
//         } )
//     }
// }

exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.updateCaption = async ( req, res ) => {
    try {

        const post = await Post.findById( req.params.id );

        if ( !post ) {
            return res.status( 404 ).json( {
                success: false,
                message: "Post not found..!!"
            } );
        }

        if ( post.owner.toString() !== req.user._id.toString() ) {
            return res.status( 401 ).json( {
                success: false,
                message: "Unauthrized",
            } )
        }

        post.caption = req.body.caption;
        await post.save();
        res.status( 200 ).json( {
            success: true,
            message: "Post updated..!!",
        })

        
    } catch (error) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        })
    }
}

exports.commentOnPost = async ( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );
        // console.log( post )

        if ( !post ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Post not found..!!"
            } );
        }

        let commentIndex = -1;
        // check if comment already exists

        post.comments.forEach( ( item, index ) => {
            if ( item.user.toString() === req.user._id.toString() ) {
                commentIndex = index;
                
            }
        } );

        if ( commentIndex !== -1 ) {

            post.comments[commentIndex].comment = req.body.comment;
            
            await post.save();

            return res.status( 200 ).json( {
                success: true,
                message: 'Comment updated successfully..!!'
            } )
            
        } else {
            post.comments.push( {
                user: req.user._id,
                comment: req.body.comment
            } );
            
            await post.save();
            res.status( 200 ).json( {
                success: true,
                message: "Comment added..!!"
            } )
        }

    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } )
    }
};

exports.deleteComment = async ( req, res ) => {
    try {

        const post = await Post.findById( req.params.id );
        
        if ( !post ) {
            return res.status( 404 ).json( {
                success: false,
                message: "Post not found..!!"
            } );
        }

        // Checking If owenr wants to delete 
        if ( post.owner.toString() === req.user._id.toString() ) {

            // check if comment exists
            if ( req.body.commentId  == undefined) {
                return res.status( 400 ).json( {
                    success: false,
                    message: "Comment Id is required..!!"
                } );
            }
            
             post.comments.forEach( ( item, index ) => {
                if ( item._id.toString() === req.body.commentId.toString() ) {
                  return  post.comments.splice( index, 1 );
                }
             } );
            
            await post.save();

            return res.status( 200 ).json( {
                success: true,
                message: "Selected Comment deleted..!!"
            } );
            
        } else {
            post.comments.forEach( ( item, index ) => {
                if ( item.user.toString() === req.user._id.toString() ) {
                  return  post.comments.splice( index, 1 );
                }
            } );

            await post.save();
            res.status( 200 ).json( {
                success: true,
                message: "Your Comment deleted..!!"
            } );
        }

    } catch ( error ) {
        res.status( 500 ).json( {
            success: false,
            message: error.message
        } );
    }
}