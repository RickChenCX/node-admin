import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";

export type UserModel = mongoose.Document & {
    id: Number,
    username: String,
    password: String,
    joinTime: Date,

    comparePassword: comparePasswordFunction,

};

const  userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    joinTime: Date,
});

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;


// 保存之前做一下加密
userSchema.pre("pre", function save(next) {
    // cryptoJs.MD5(req.body.password).toString());
    const user = this;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
          if (err) { return next(err); }
          user.password = hash;
          next();
        });
      });

});

// 解密保存的密文
const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

const User = mongoose.model("User", userSchema);
export default User;

// exports.findByUsername = function(username: string) {
//     User.findOne({ name : username}, function(err: any, adventure: any) {
//             if (err) {
//                 throw err ;
//             }
//     });
// };