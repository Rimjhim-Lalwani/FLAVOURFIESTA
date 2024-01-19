const blog=require("../model/blog");
const User=require("../model/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto=require("crypto");
const sendEmail=require("../utils/util");
const Token=require("../model/token");
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const middleware = require('../middleware/middleware');

function checkIsLoggedIn(req,res,next){
    console.log(req.session.isLoggedIn);
    if(req.session.isLoggedIn){
       
        next();
    }else{
        res.redirect("/login");
    }
}
router.get("/",middleware.getAllBlogs,(req,res)=>{})

router.get("/login",(req,res)=>{
    res.render("login");
})

router.get("/register",(req,res)=>{
    res.render("register");
})
router.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    bcrypt.hash(password, saltRounds).then(async function(hash) {
        // Store hash in your password DB.
        const newUser=new User({username,email,password:hash});
        await newUser.save();
        let token = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          console.log(token.userId);
          const message = `http://localhost:3001/verify/${newUser.id}/${token.token}`;
          if(newUser.username=="admin" && newUser.email=="rimjhim2361.be21@chitkara.edu.in"){
            newUser.verify=true;
            await
            Token.findByIdAndDelete(token._id);
            res.redirect("/login");
          }
          else{
          await sendEmail(newUser.email, "Verify Email", message);
         console.log(newUser.email)
          res.send("verify your email (${newUser.email}) by clicking on the link sent to your email ");
          }
    });
    
     }
)
          
    
    

router.get("/verify/:id/:token",async(req,res)=>{
    const {id}=req.params;
    console.log(id);
    let user= await User.findOne({_id:id});
    console.log("hi");
    if(!user) return res.status(400).send("Invalid link");

    let token=await Token.findOne({userId:id,token:req.params.token});
    if(!token) return res.status(400).send("Invalid link");
    // await User.updateOne({_id:user.id,verify:true});
    user.verify=true;
    await user.save();
    await Token.findByIdAndDelete(token._id);
    res.redirect("/login");
})
router.post("/login",async(req,res,next)=>{
    const {username,password}=req.body;
    let user=await User.findOne({username:username});
    if(user){
        bcrypt.compare(password, user.password).then(function(result) {
            // result == true
            if(result != true){
                res.send("Invalid password");
            }else{
                req.session.isLoggedIn = true;
                req.session.user = user; 
                // console.log(req.session.isLoggedIn);
                if(user.username=="admin"){
                res.redirect("/adminhome");}
                else res.redirect("/userhome");
            }
        });
        
    }else{
        res.send('user not found ! register here <a href="/register">Register</a>');

    }
})
router.get("/userhome2",checkIsLoggedIn,async(req,res)=>{
    let blogsadmin = await blog.find({}).populate("user");
        res.render('userhome2', { blogsadmin });
})

router.get("/addblog",checkIsLoggedIn,(req,res)=>{
    res.render("addblog");
})
router.post("/addblog", upload.single("image"),async(req,res)=>{
    const {title,ingredients,steps}=req.body;
    const {path} =req.file;
    let newBlog=new blog({title,ingredients,steps,image:path,user:req.session.user._id});
    // console.log({image});
    await newBlog.save();
    let user=await User.findOne({_id:req.session.user._id})
    
     user.blog.push(newBlog._id);
     await user.save();
  
     if(user.username=="admin"){
        newBlog.verify=true;
        await newBlog.save();
        res.redirect("/adminhome");}
        else {
            console.log("ok");
            res.send('PLEASE WAIT FOR ADMIN APPROVAL! <br> GO TO <a href="/userhome">HOMEPAGE</a>')}
    // 
})

router.get("/adminhome",checkIsLoggedIn,middleware.getAllBlogsadmin,(req,res)=>{})
router.get("/adminhome2",checkIsLoggedIn,async(req,res)=>{
    let blogs=await blog.find({user:req.session.user._id}).populate("user");
        console.log(blogs);
        res.render('adminhome2', { blogs });
})
router.get("/userhome",checkIsLoggedIn,middleware.getBlogByUser,(req,res)=>{})
router.get("/userhome2",checkIsLoggedIn,middleware.getAllBlogsadmin,(req,res)=>{})
router.post('/deleteBlog/:blogId', middleware.deleteBlog);
router.get('/deleteBlog/admin/home', middleware.getAllBlogsadmin, (req, res) => {})
router.get('/deleteBlog/user/home', middleware.getBlogByUser, (req, res) => {})
router.post('/fullblog/:blogId', middleware.fullblog);
router.get("/fullblog/fullblog",(req,res)=>{})
router.get("/notification",middleware.notification,(req,res)=>{})
router.post('/approve/:blogId',middleware.approve,middleware.notification,(req,res)=>{});
module.exports=router;