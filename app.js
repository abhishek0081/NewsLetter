const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
const express = require('express');
const bodyParser =  require('body-parser');
const requests = require('request');
const https = require('https');
// const imp = require( `${__dirname}/.secrets.js`);
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
app.get("/",(req,res)=>{
    res.sendFile(`${__dirname}/signUp.html`)
})
app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const email = req.body.email;
    const lastName = req.body.lastName;

    const data = {
        email_address:email,
        status:"subscribed",
        merge_fields:{
            FNAME : firstName,
            LNAME : lastName
        }
    };
    
    const jsonData = JSON.stringify(data);
    const options = {
        method:"POST",
        auth: `abhishek1:${process.env.media}`
    }


    const url = `https://us12.api.mailchimp.com/3.0/lists/${process.env.audience}/members?skip_merge_validation=${false}`;

    const request = https.request(url,options,response=>{
        console.log(response.statusCode);
        if (response.statusCode >= 200 && response.statusCode <= 299 ){

            res.sendFile(`${__dirname}/success.html`)
         }
        else{
            res.sendFile(`${__dirname}/failure.html`)
        }
        response.on('data',data=>{
        //     const responseData = JSON.parse(data);
        //     const statusCode = responseData['status']
        //     console.log(typeof statusCode)
        //     console.log( statusCode)
        //     if (statusCode === "subscribed"){
        //         res.sendFile(`${__dirname}/success.html`)
        //     }else{
        //         res.sendFile(`${__dirname}/failure.html`)
        //     }
        })
    })

    
    request.write(jsonData);
    request.end();

    // res.send();

})

app.post("/failure",(req,res)=>{
    // res.sendFile(`${__dirname}/signUp.html`)
    res.redirect("/");
})

const port = 4000;

app.listen(process.env.PORT||port,()=>console.log(`server is runing on port ${port}`));


