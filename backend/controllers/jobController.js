const { catchAsyncErrors } = require('../middleware/catchAsyncErrors.js');
const {ErrorHandler} = require('../middleware/error.js');
const Job = require("../models/JobModel.js");


/*exports.createJobController=async(req,res,next)=>{

}*/
const getAllJobs = catchAsyncErrors(async (req, res, next) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({
            success: true,
            jobs: jobs // Sending the fetched jobs data in the response
        });
    } catch (error) {
        next(error); // Forwarding any error to the error handling middleware
    }
});



const postAJob = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
          new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
      }
      const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
      } = req.body;
    
      if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details.", 400));
      }
    
      if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
          new ErrorHandler(
            "Please either provide fixed salary or ranged salary.",
            400
          )
        );
      }
    
      if (salaryFrom && salaryTo && fixedSalary) {
        return next(
          new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
        );
      }
      const postedBy = req.user._id;
      const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
      });
      res.status(200).json({
        success: true,
        message: "Job Posted Successfully!",
        job,
      });
    });
module.exports = postAJob;
//affiche les jobs created by employer
const getMyJobs = catchAsyncErrors(async (req, res, next) => {
    const { role } = await req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.",400)
        );
    }
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
    });
});

const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Check if the user is a Job Seeker
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;

  // Find and update the job
  let job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Check if the job was found and updated
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }

  // Send a success response
  res.status(200).json({
    success: true,
    message: "Job Updated!",
    job,
  });
});

const deleteJob = async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler( "Job Seeker not allowed to access this resource.", 400))
        ;
    }
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next (
            new ErrorHandler("OOPS! Job not found.", 404))
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job Deleted!",
    });
};

const getSingleJob = async (req, res, next) => {
  const { id } = req.params;
  try {
      const job = await Job.findById(id);
      if (!job) {
          return res.status(404).send("Job not found.");
      }
      return res.status(200).json({
          success: true,
          job,
      });
  } catch (error) {
      return res.status(400).send("Invalid ID / CastError");
  }
};


module.exports= {
    getAllJobs,
    postAJob,
    getMyJobs,
    updateJob,
    deleteJob,
    getSingleJob};