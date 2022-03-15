const nodeMailer = require( 'nodemailer' );


exports.sendEmail = async ( options ) => {

    var transporter = nodeMailer.createTransport( {

         service: "gmail",//process.env.SMPT_SERVICE,
        host: "smtp.gmail.com", //process.env.SMPT_HOST,
        port:  465,//process.env.SMPT_PORT,
        auth: {
            user: "a9427511425@gmail.com",//process.env.SMPT_MAIL,
            pass: "Keval123"//process.env.SMPT_PASSWORD,
        },

       

    } );
    

//     var transporter = nodeMailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "65850f5f10e5fa",
//     pass: "cddf99a1d1b990"
//   }
// });

    
    console.log(options.email)
    const mailOptions = {
        from: "a9427511425@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail( mailOptions );

}






/**
 * 
: let mailTransporter = nodemailer.createTransport(transport); and mailTransporter.sendMail()

Do this : transport.sendMail()
 */



// const sendEmail = async (options) => {
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.SMPT_MAIL,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

