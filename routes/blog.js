const {Router}= require("express");
const Blog= require("../models/blog")
const Comment= require("../models/comment")
const router= Router();
const multer= require("multer");
const path= require("path");
const { log } = require("console");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });
  
  const upload = multer({ storage: storage });

router.get("/add", (req, res)=>{
    return res.render("addblog", { user: req.user});
})

router.post("/add", upload.single("coverImage"), async(req, res)=>{
    const {title, body, coverImageURL, createdBy}= req.body;
    console.log(req.file);
    
    await Blog.create({
        title, 
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy
    })

    return res.redirect("/");
})

router.get("/:id", async(req, res)=>{
    const id= req.params.id
    const blog= await Blog.findById(id).populate("createdBy");
    
    const comments= await Comment.find({blogId: id}).populate("createdBy")
    
    return res.render("blog", {
        blog: blog,
        user: req.user,
        comments,
    })
})

router.post("/comment", async(req, res)=>{
    const {content, blogId }= req.body;
    // const blogId= req.blogId;
    // console.log(blogId);
    
    await Comment.create({
        content,
        blogId,
        createdBy: req.user.id,
    })
    return res.redirect(`/blog/${blogId}`)
})




module.exports= router;