const app = require( './app' );
const { connectDatabase } = require( './config/database' );


connectDatabase();

app.listen( process.env.PORT, () => {


    console.log(`server is running..! ${process.env.PORT}`);
})