// //old way of importing
// // const http=require("http");
// // const temp=require("./features");

// //new way of importing
// import http from "http"
// import fs from "fs"//this module is used to read and write any file
// import path from "path"
// import temp, { temp1, temp2 } from "./features.js"//for named export name should be exactly same , but for default export any name is fine
// import * as myObj from "./features.js"



// console.log(temp);
// console.log(temp1);
// console.log(temp2);
// console.log(myObj);
// console.log(myObj.tempFunction());
// // console.log(http);

// const syncHome = fs.readFileSync("./index.html");//readFileSync() is synchronous so it will be executed in a normal flow
// // console.log(syncHome);

// console.log(path.extname("/home/random/wow.html"));

// const server = http.createServer((req, res) => {//creating the server
//     console.log("--------------------");//////////this will work when you will hit the URL//////////
//     console.log(req.method);
//     console.log(req.url);
//     if (req.url === '/') {
//         // fs.readFile("./index.html",(err,data)=>{//readfile() is asynchronous so it will be executed at last
//         //     res.end(data);
//         // })
//         res.end(syncHome);
//     }
//     else if (req.url === '/about') {
//         res.end("<h1>ABOUT PAGE</h1>");
//     }
//     else if (req.url === '/contact') {
//         res.end("<h1>CONTACT PAGE</h1>");
//     }
//     else {
//         res.end(`<h1>LOADING...${myObj.tempFunction()}</h1>`);
//     }
// })

// server.listen(5000, () => {//5000 is port number
//     console.log("Server is working");
// })


/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////AFTER INSTALLING EXPRESS/////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";//JWT stands for JSON Web Token, which is an open standard that allows for the secure transmission of information between parties as a JSON object.
// import fs from "fs";
import path from "path";
import { log } from 'console';
const server = express();//exactly same as creating server(http.createServer((req, res){})

//set this line(then you do not have to write the .ejs extension again and again)
server.set("view engine","ejs");//setting it for dynamic files

//To access static file use express.static()
// console.log(path.join(path.resolve(),"public"));
//express.static(path.join(path.resolve(),'public'))//this is a "middleware"
// to use a "middleware" we need to use the ".use" keyword
server.use(express.static(path.join(path.resolve(),'public')));//setting public folder as static files
server.use(express.urlencoded({extended:true}));//using this middleware for accesing data from "form(index.ejs)"
server.use(express.json());//this middleware is used to receive data from POSTMAN/any api platform as "json"
server.use(cookieParser());//used to access cookie

// const users=[];


// server.get("/", (req, res, next) => {
//     // res.send("HI");
//     // res.sendStatus(500);
//     // res.json({
//     //     success : true,
//     //     products : []
//     // })
//     // res.status(500).send("Coming from chaining");//chaining


//     // console.log(path.resolve());//will give the current path
//     // const pathlocation = path.join(path.resolve(),"./views/index.html");
//     // res.sendFile(pathlocation);

//     //////////////These are after installing "ejs//////////////
//     // res.render("index.ejs",{name:"Choudhury Abhisek Panda"})//render is used to render dynamic data(this "index" will refer to /views/index.ejs)

// })

server.get("/success",(req,res)=>{
    res.render("success.ejs");
})

// server.get("/users",(req,res)=>{
//     res.json({users});
// })

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//MongoDB start
mongoose.connect("mongodb://0.0.0.0:27017/",{
    dbName:"practice",
}).then(()=>console.log("Database Connected")).catch((e)=>console.log(e));

//Creating Scehma for adding data to our collection(table) i.e. practice
const messageschema = new mongoose.Schema({
    name:String,
    email:String
});

//Creating a model(used to call the collection)
const Message=mongoose.model("Message",messageschema);//it will create the schema as (message+'s' = i.e. messages)or("abc"=>"abcs")


///////////////////CRUD through POSTMAN///////////////////
//Create new data
server.post("/contact",async (req,res)=>{
    console.log(req.body);
    await Message.create({name: req.body.name,email: req.body.email});//here we are stroring our data in DB

    //or user these below 2 lines instaed of above line
    // let data= new Message({name: req.body.name,email: req.body.email});//here we are stroring our data in DB
    // await data.save();

    res.redirect("success");//or you can directly use "render()"
})

//Read
server.get("/userdetails",async (req,res)=>{
    const dbData=await Message.find();//Find data from DB
    res.send(dbData);
})

// Update
server.put("/update/:name",async (req,res)=>{
    console.log(req.params);
    console.log(req.body);
    // const {name}=req.params;
    // const data=req.body;
    let response=await Message.updateOne({...req.params},{...req.body});
    res.send(response);
})

//Delete
server.delete("/deletedetails",async (req,res) => {
    let response=await Message.deleteOne(req.body);
    res.send(response);
})


/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////AUTHENTICATION////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const isAuthenticated = async (req,res,next) =>{//this is our own handlers(or we can say it as our own "miidleWare")
    console.log(req.cookies);//for cookies==>install (cookie-parser)i.e. "npm i cookie-parser" and then import cookie-parser and then use the middleware(server.use(cookieParser());)
    const {token}=req.cookies;
    
    if(token){
        const decodeToken = jwt.verify(token,"randomsecretkey");//this will decode our token
        console.log(decodeToken);
        req.userFullData = await User.findById(decodeToken._id);
        //These above 3 lines are not required generally 
        
        next();//it will refer to the next handlers of "isAuthenticated"
    }else{
        res.render("login.ejs");
    }
}

server.get("/", isAuthenticated , (req, res) => {
    //authentication chapter
    res.render("logout.ejs");
})

//Only refer to "login.ejs" page
server.post("/login",async (req,res)=>{
    console.log(req.body);
    const userdata = await User.create(req.body);//this will inser the req.body to DB

    const token =  jwt.sign({_id:userdata._id},"randomsecretkey"); //this will create an new jwt token ("randomsecretvalue" is a secret key to decode the data)
    console.log(token);
    
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    });
    res.redirect("/");
})

server.get("/logout",(req,res)=>{
    res.cookie("token","null",{ //here we are making the cookie "null"
        httpOnly:true,
        expires:new Date(Date.now())//cookie will expire at the current moment
    });
    res.redirect("/");
})

// Now we will create a new schema in Mongo and also we will create a model
const userschema = new mongoose.Schema({
    name:String,
    email:String
});

const User=mongoose.model("User",userschema);













server.listen(5000, () => {
    console.log("Server is Working");
})
// 

