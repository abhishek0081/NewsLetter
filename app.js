const express = require('express');
const bodyParser =  require('body-parser');
const requests = require('request');
const https = require('https');
// const { error } = require('console');

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
    // const password = req.body.password;

    const data = {
        email_address:email,
        status:"subscribed",
        merge_fields:{
            FNAME : firstName,
            LNAME : lastName
        }
    };
    
    const jsonData = JSON.stringify(data);
    const audienceId = 'deac232de2';
    const options = {
        method:"POST",
        auth:"abhishek1:a272afad3d07b1703c2ea89b9e9a8c74-us12"
    }

    const url = `https://us12.api.mailchimp.com/3.0/lists/${audienceId}/members?skip_merge_validation=${true}`;

    const request = https.request(url,options,response=>{

        if (response.statusCode === 200){
            res.sendFile(`${__dirname}/success.html`)
         }//else if(response.statusCode === 400){
        //     res.send('<script>alert("User Exists")</script>')
            
        // }
        else{
            res.sendFile(`${__dirname}/failure.html`)
        }
        response.on('data',data=>{
            const responseData = JSON.parse(data);
            const statusCode = responseData['status']
            // console.log(typeof statusCode)
            // console.log( statusCode)
            // if (statusCode === "subscribed"){
            //     res.sendFile(`${__dirname}/success.html`)
            // }else{
            //     res.sendFile(`${__dirname}/failure.html`)
            // }
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


app.listen(process.env.PORT,()=>console.log('server is runign on port 3000'));



//const apiKey  a272afad3d07b1703c2ea89b9e9a8c74-us12 X = 12 in my case
