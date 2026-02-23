const express = require('express');
const { getAllJobs ,postAJob, getMyJobs, updateJob, deleteJob,getSingleJob} = require("../controllers/jobController.js");
const {isauthenticate}=require('../middleware/authenticate.js')
const route= express.Router();
//fetch all jobs 
route.get("/getall", getAllJobs);

//create-job || post 
route.post("/post-job",isauthenticate, postAJob);
//get all job creer par employer
route.get("/getMyjobs",isauthenticate,getMyJobs);
//updated you job 
route.put("/update/:id",isauthenticate,updateJob);

route.delete("/delete/:id",isauthenticate,deleteJob);
route.get("/:id", getSingleJob);
module.exports = route;