const express = require('express');
const { signup, signin, logout, userprofile } = require('../controllers/authcontroller');
const { isauthenticate } = require('../middleware/authenticate');
const { getAllEmployer, createUser, getAllJobSeeker, updateUser, deleteUser, getUserById } = require('../controllers/userController');

const router = express.Router();
//auth routes
// /api/signup
router.post('/signup', signup);

// /api/signin
router.post('/signin', signin);

// /api/logout
//router.get('/logout',isauthenticate,logout);

// /api/userp
router.get('/userp', isauthenticate, userprofile);
//get all employer
router.get('/getallemployer',isauthenticate,getAllEmployer);
//get all job seeker
router.get('/getalljobseeker',isauthenticate,getAllJobSeeker);
//ajouter user
router.post('/createUser',isauthenticate,createUser);
// Update an existing user
router.put('/updateuser/:id', updateUser);

// Delete a user
router.delete('/deleteuser/:id', deleteUser);
// get a user
router.get('/getuser/:id', getUserById);
module.exports = router;