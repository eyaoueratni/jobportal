import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user && user.role === "Employer") {
          const res = await axios.get("http://localhost:2022/api/application/employer/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        } else {
          const res = await axios.get("http://localhost:2022/api/application/jobseeker/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchApplications();
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:2022/api/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleRefuse = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:2022/api/application/refuse/${id}`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success("Application refused");
      setApplications((prevApplications) =>
        prevApplications.map((app) => (app._id === id ? { ...app, status: "Refused" } : app))
      );
    } catch (error) {
      toast.error("Failed to refuse application");
    }
  };
  
  const handleApprove = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:2022/api/application/approve/${id}`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success("Application approved");
      setApplications((prevApplications) =>
        prevApplications.map((app) => (app._id === id ? { ...app, status: "Approved" } : app))
      );
    } catch (error) {
      toast.error("Failed to approve application");
    }
  };
  

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length <= 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length <= 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
                handleApprove={handleApprove}
                handleRefuse={handleRefuse}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
        <p>
          <span>Status:</span> <span className={`status ${element.status}`}>{element.status}</span>
        </p>
      </div>
      <div className="resume">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>Delete Application</button>
      </div>
    </div>
  );
};


const EmployerCard = ({ element, openModal, handleApprove, handleRefuse }) => {
  const [status, setStatus] = useState('Pending'); // Assuming initial status is 'Pending'

  const handleApproveOrRefuse = (id) => {
    // Update status based on which button is clicked
    if (status === 'Pending') {
      setStatus('Approved');
      handleApprove(id);
    } else if (status === 'Approved') {
      setStatus('Refused');
      handleRefuse(id);
    }
  };

  return (
    <div className="job_seeker_card">
      <div className="status">{status}</div>
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
      </div>
      {status === 'Pending' && (
        <div className="button_wrapper">
          <div className="edit_btn_wrapper">
            <button onClick={() => handleApproveOrRefuse(element._id)} className="approve_btn">
              Approve
            </button>
          </div>
          <button onClick={() => handleApproveOrRefuse(element._id)} className="refuse_btn">
            Refuse
          </button>
        </div>
      )}
    </div>
  );
};
