const express = require( 'express' );
const { is } = require( 'express/lib/request' );
const { createPost, likeAndUnlikePost, deletePost } = require( '../controllers/post.controller' );
const { isAuthenticated } = require( '../middlewares/auth' );

const router = express.Router();

router.route( '/post/upload' ).post( isAuthenticated, createPost );

router.route( '/post/:id' )
    .get( isAuthenticated, likeAndUnlikePost )
    .delete( isAuthenticated, deletePost ); 



module.exports = router;