const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
//check is user authenticate 
exports.isauthenticate = async (req, res, next) => {
    const { token } = req.cookies;
    //make sure token exists
    if (!token) {
        return res.status(200).send({
            message: "Auth Failed",
            success: false,
          });
    }
    try {
        //verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user= await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message:"auth failed",
            success:false,
        })
}}
//middleware for admin
/*exports.isAdmin = async (req, res, next) => {
    if (req.user.role == 0) {
        return next(new ErrorHandler('access denied u must be admin', 401));

    }
    next();
}*/

