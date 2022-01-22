const express = require( 'express' );
const { register, login, followUser } = require( '../controllers/user.controller' );
const { isAuthenticated } = require( '../middlewares/auth' );


const router = express.Router();

router.route( '/register' ).post( register );

router.route( '/login' ).post( login );

router.route( '/follow/:id' ).get( isAuthenticated, followUser );

module.exports = router;