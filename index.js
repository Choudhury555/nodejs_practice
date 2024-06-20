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
// import fs from "fs";
import path from "path";
const server = express();//exactly same as creating server(http.createServer((req, res){})

//set this line(then you do not have to write the .ejs extension again and again)
server.set("view engine","ejs");//setting it for dynamic files

//To access static file use express.static()
// console.log(path.join(path.resolve(),"public"));
//express.static(path.join(path.resolve(),'public'))//this is a "middleware"
// to use a "middleware" we need to use the ".use" keyword
server.use(express.static(path.join(path.resolve(),'public')));//setting public folder as static files
server.use(express.urlencoded({extended:true}));//using this middleware for accesing data from "form(index.ejs)"

const users=[];

server.get("/", (req, res, next) => {
    // res.send("HI");
    // res.sendStatus(500);
    // res.json({
    //     success : true,
    //     products : []
    // })
    // res.status(500).send("Coming from chaining");//chaining


    // console.log(path.resolve());//will give the current path
    // const pathlocation = path.join(path.resolve(),"./views/index.html");
    // res.sendFile(pathlocation);

    //////////////These are after installing "ejs//////////////
    res.render("index.ejs",{name:"Choudhury Abhisek Panda"})//render is used to render dynamic data(this "index" will refer to /views/index.ejs)
    
})

server.get("/success",(req,res)=>{
    res.render("success.ejs");
})

server.get("/users",(req,res)=>{
    res.json({users});
})

server.post("/contact",async (req,res)=>{
    // console.log(req.body);
    await Message.create({name: req.body.name,email: req.body.email});//here we are stroring our data in DB
    res.redirect("success");//or you can directly use "render()"
})

server.get("/userdetails",async (req,res)=>{
    const dbData=await Message.find();
    res.send(dbData);
})

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


server.listen(5000, () => {
    console.log("Server is Working");
})
// 

