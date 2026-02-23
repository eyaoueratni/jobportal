const { catchAsyncErrors } = require('../middleware/catchAsyncErrors.js');
const {ErrorHandler} = require('../middleware/error.js');

const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');


exports.signup = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, lastName, email, role, password } = req.body;
        if (!name || !lastName || !email || !role || !password) {
            return next(new ErrorHandler("Please fill in the full form!", 400));
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorHandler("Email already registered!", 400));
        }

        const user = await User.create(req.body);
        
        sendToken(user, 201, res,"user registered");
    } catch (error) {
        next(error);
    }
});

exports.signin = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        //validation
        if (!email || !password || !role) {
            return next(new ErrorHandler("Please provide email ,password and role.",400 ));
        }

        //check user email
        const user = await User.findOne({ email }).select("password");
        if (!user) {
            return next(new ErrorHandler("Invalid Email Or Password." ,400));
        }
        
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorHandler("Invalid Email Or Password.",400));
        }

        const allowedRoles = ['Job Seeker', 'Employer','Admin']
        if (!allowedRoles.includes(role)) {
            return next(new ErrorHandler("user with this role not found",400));
        }
        // Utilisez req.context pour accéder au contexte
  req.context.setIsAuthorized(true);


        sendToken(user, 200, res,'user loged in ');
    } catch (error) {
        next(error);
    }
}


exports.logout = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged Out Successfully.",
      });
  });
  
  
  


//user profile 
exports.userprofile = async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
}