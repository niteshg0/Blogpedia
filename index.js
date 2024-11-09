const express= require("express");
const path= require("path");
require('dotenv').config()
const { connectToMongoDb } = require("./connection");
const userrouter = require("./routes/user");
const blogRoute= require("./routes/blog")
const app= express();
const PORT= process.env.PORT || 8000;
const cookie_parser= require("cookie-parser");
const {checkAuthentication } = require("./middlewares/authcheck");
const Blog= require("./models/blog")


app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

connectToMongoDb(process.env.MONGO_URL).then(()=>{console.log("DB connected")})

app.use(express.urlencoded({extended: false}))
app.use(cookie_parser())
app.use(checkAuthentication)
app.use(express.static(path.resolve('./public')))
//toshow images allow express to access it



app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 }) // Sorts in descending order by 'createdAt'
    return res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});


app.use("/user", userrouter);
app.use("/blog", blogRoute);

app.listen(PORT, ()=>{
    console.log("start ho gya", PORT)
})

