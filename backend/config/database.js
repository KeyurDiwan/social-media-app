const mongoose = require( 'mongoose' );

exports.connectDatabase = () => {
    mongoose.connect( process.env.MONGO_URL )
        .then( ( con ) => console.log( 'database connected..!', con.connection.host ) )
        .catch((err) => console.log(err))
}