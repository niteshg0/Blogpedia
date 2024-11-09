const { getUser } = require("../services/auth");


function checkAuthentication(req, res, next){
    const token= req.cookies?.token;

    if(!token) return next();

    const user= getUser(token);
    if(!user)  return res.redirect("/signin");


    req.user= user;

    return next();
}


module.exports={
    checkAuthentication,

}