const mongoose= require("mongoose");
const {createHmac, randomBytes}= require("crypto")

const userSchema= new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        
    },
    password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    profileImageURL: {
        type: String,
        required: true,
        default: "/images/profile.jpeg"
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },


}, {timeStamps: true})

userSchema.pre("save", function(next){
    const user= this;

    if(!user.isModified("password")) return;

    //This ensures that if the password hasn't changed, it won’t be rehashed. This is useful when updating other fields in the user document

    //salt(random data) is like secret key but unique for each user
    const salt= randomBytes(16).toString();
    const hashedPassword= createHmac("sha256", salt)
        .update(user.password)
        .digest("hex")
    //return in hex form
    //SHA-256 hashing algorithm 
    //hashed password can never be restored  we match the entered password by hashing it to stored password while signin 

    this.salt= salt;
    this.password= hashedPassword;

    next()
})

const USER= mongoose.model("users", userSchema);

module.exports= USER;


/* 
In the event of a data breach, the hashed passwords offer a layer of protection, as they can’t be used directly without decryption (which is difficult with a strong hash function and unique salt).
*/

