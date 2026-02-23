const User = require('../models/userModel');
const { catchAsyncErrors } = require('../middleware/catchAsyncErrors.js');
const {ErrorHandler} = require('../middleware/error.js');
const getUserById = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.params.id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
        const user = await User.findById(userId); // Rechercher l'utilisateur dans la base de données en utilisant son ID
        if (!user) {
            // Si aucun utilisateur n'est trouvé avec cet ID, renvoyer une réponse d'erreur
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Si l'utilisateur est trouvé, renvoyer les données de l'utilisateur dans la réponse
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        next(error); // Transmettre toute erreur à la fonction de gestion des erreurs suivante
    }
});

const getAllEmployer = catchAsyncErrors(async (req, res, next) => {
    try {
        const employers = await User.find({ role: "Employer" });
        res.status(200).json({
            success: true,
            employers: employers // Sending the fetched employers data in the response
        });
    } catch (error) {
        next(error); // Forwarding any error to the error handling middleware
    }
});
const getAllJobSeeker = catchAsyncErrors(async (req, res, next) => {
    try {
        const employers = await User.find({ role: "Job Seeker" });
        res.status(200).json({
            success: true,
            employers: employers // Sending the fetched employers data in the response
        });
    } catch (error) {
        next(error); // Forwarding any error to the error handling middleware
    }
});
const createUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, lastName, email, password, role } = req.body;

        const user = new User({ name, lastName, email, password, role });
        await user.save();

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
});
const updateUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, lastName, email, role } = req.body;

        const user = await User.findByIdAndUpdate(userId, { name, lastName, email, role }, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
});
const deleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});


//exports.allusers=async (res,req)
 module.exports={ getAllEmployer,
    createUser,
    getAllJobSeeker,
    updateUser,
    deleteUser,
    getUserById
 }