var express = require("express");
var app = express();

//BODY PARSER REQUIRE
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//METHOD OVERRODE REQUIRE
var methodOverride=require("method-override");
app.use(methodOverride("_method"));

//MONGOOSE REQUIRE
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/rest_blog_app");

//TELLING APP TO USE PUBLIC DIRECTORY
app.use(express.static("public"));

//DB CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Dogs",
//     image: "https://static.boredpanda.com/blog/wp-content/uploads/2016/01/bear-dogs-310__605.jpg",
//     body: String,
// });

//RESTful ROUTES

app.get("/",function(req,res){
    res.redirect("/blog");
});

//INDEX
app.get("/blog",function(req,res){
    Blog.find({},function(err,blog){
        if(err){
            console.log("ERROR");
        }
        else{
            res.render("index.ejs",{blog:blog}); 
        }
    });
});

//NEW
app.get('/blog/new',function(req,res){
   res.render("new.ejs");
});

//CREATE
app.post('/blog',function(req,res){
    Blog.create(req.body.blog, function(err,blog){
        if(err){
            res.redirect("/blog/new");
        }
        else{
            res.redirect("/blog");
        }
    });
});

//SHOW
app.get("/blog/:id",function(req,res){
    Blog.findById( req.params.id, function(err,blog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.render("show.ejs",{blog:blog});
        }
    });
});

//EDIT
app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.render("/blog");
        }else{
            res.render("edit.ejs",{blog:blog}); 
        }
    });
   
});

//UPDATE
app.put('/blog/:id', function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,blog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.redirect("/blog/" + req.params.id);
        }
    });
});

//DELETE
app.delete("/blog/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            alert("cant be deleted");
        }
        else{
            res.redirect("/blog");
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("server started");
});