const jwt= require("jsonwebtoken")
const secret= process.env.SECRET

function setUser(user){
    const payload= {
        id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
        fullName: user.fullName,
    }
    return jwt.sign(payload, secret)
}

function getUser(token){
    if(!token) return null;

    try {
        return jwt.verify(token, secret)

    } catch (error) {
        return null;
    }
}

module.exports= {
    setUser,
    getUser
}