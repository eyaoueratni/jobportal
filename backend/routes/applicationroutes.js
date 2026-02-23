const express = require('express');
const { employerGetAllApplications,jobseekerDeleteApplication,jobseekerGetAllApplications,postApplication, applicationRefused, applicationApproved } = require('../controllers/applicationController');

const { isauthenticate } = require('../middleware/authenticate');
const router = express.Router();

router.post("/post", isauthenticate, postApplication);
router.get("/employer/getall", isauthenticate, employerGetAllApplications);
router.get("/jobseeker/getall", isauthenticate, jobseekerGetAllApplications);
router.delete("/delete/:id", isauthenticate, jobseekerDeleteApplication);
router.post('/refuse/:id', isauthenticate, applicationRefused);
router.post('/approve/:id', isauthenticate, applicationApproved);
module.exports = router;