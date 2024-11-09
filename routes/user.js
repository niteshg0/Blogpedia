// const express= require("express")
// const router= express.Router()

const {Router}= require("express")
const router= Router();
const {createHmac, randomBytes}= require("crypto")
const {setUser}= require("../services/auth")


const User= require("../models/users")

router.get("/signup", (req, res)=>{
    return res.render("signup")
})

router.get("/signin", (req, res)=>{
    return res.render("signin")
})

router.post("/signup",  async(req, res)=>{
    const {fullName, email, password}= req.body;

    await User.create({
        fullName,
        email,
        password
    })

    return res.redirect("/")
})

router.post("/signin",  async(req, res)=>{
    const {email, password}= req.body;

    const user= await User.findOne({email});
    if(!user) return res.render("signin", {
        error: "Incorrect email"
    })   

    const salt= user.salt;
    const hashedPassword= createHmac("sha256", salt)
        .update(password)
        .digest("hex")

    if(hashedPassword !== user.password)  return res.render("signin", {error: "Incorrect password"})   
    
    const token= setUser(user);
    // console.log(token);

    
    return res.cookie("token", token).redirect("/")
})

router.get("/signout", (req, res)=>{
    return res.clearCookie("token").redirect("/")
})


module.exports= router

