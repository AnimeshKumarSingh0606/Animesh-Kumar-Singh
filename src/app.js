const express = require("express");
const app =express();
const path=require("path");
const {pool}=require("../dbconfig");
const hbs=require("hbs");
const swal=require("sweetalert");
//const popup=require("popups");
// import swal from 'sweetalert';
const port=process.env.PORT || 3000;
const session=require("express-session");
const flash=require("connect-flash");
const staticpath=path.join(__dirname,"../public");
const templatepath=path.join(__dirname,"../templates/views");
const partialpath=path.join(__dirname,"../templates/partials");
app.use(express.urlencoded({exttended:false}));
app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));
app.use(express.static(staticpath));
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);
app.use(session({
    secret:"secret",
    cookie: {maxAge:600000},
    resave:false,
    saveUninitialized:false
}));
app.use(flash());

app.get("/",(req,res)=>{
    res.render("index");
});

app.post("/message",(req,res)=>{
    let {name,email,message}=req.body;
    console.log({name,email,message});
    pool.query(`insert into messagehelp (name,email,helpmessage) values ($1,$2,$3)`,[name,email,message],(err,result)=>{
        if(err){
            throw err;
        }
        console.log(result.rows);
        //swal("Thank you for Reaching out to Animesh .He will approach you with a Solution soon","", "success");
        //popup.alert({content:"Thank you for Reaching out to Animesh .He will approach you with a Solution soon"});
        res.render("index");
    });
});

 app.post("/subscribe", (req,res)=>{
     let {sname,semail}=req.body;
     console.log({sname,semail});
     pool.query(`select * from subscriptions where email=$1`,[semail],(err,result)=>{
         if(err){
             throw err;
         }

         if(result.rows.length>0){
             console.log("email already exists");
            //swal("Oop!! You Have Already subscribed using this email","", "error");
           //popup.alert({content:"Oop!! You Have Already subscribed using this email"});
            
             res.render("index");
         }else{
             pool.query(`insert into subscriptions (name,email) values ($1,$2)`,[sname,semail],(err,result)=>{
                 if(err){
                     throw err;
                 }
                 console.log("registered successfully");
                 //swal("Thank you Now you will get notifications regaring Animesh's Newsletter","", "success");
                // popup.alert({content:"Thank you Now you will get notifications regaring Animesh's Newsletter"});
                 res.render("index");
             })
         }
     })
 })

app.listen(port , ()=>{
    console.log(`The server is listening at ${port}`);
})