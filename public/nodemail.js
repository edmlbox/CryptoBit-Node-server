
const nodemailer = require('nodemailer');


let nodemailerExport = (from,to,subject,html)=>{
	
	
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'ethereumserver@gmail.com',
        pass: 'geniunetee1990'
    }
});

const mailOptions = {
  from: from, // sender address
  to: to, // list of receivers
  subject: subject, // Subject line
  html: html// plain text body
};



transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});
	
	
	
	
}

module.exports = {
	one:nodemailerExport
}

