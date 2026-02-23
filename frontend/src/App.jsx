import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import JobDetails from "./components/Job/JobDetails";
import Jobs from "./components/Job/Jobs";
import MyJobs from "./components/Job/MyJobs";
import PostJob from "./components/Job/PostJob";
import Footer from "./components/Layout/Footer";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/NotFound/NotFound";
import AddUser from "./components/User/AddUser";
import EditUser from "./components/User/EditUser";
import Employer from "./components/User/Employer";
import User from "./components/User/User";
import { Context } from "./main";

const App = () => {
  
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2022/api/user/userp",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/user" element={<User />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/edituser/:id" element={<EditUser/>} />
        <Route path="/adduser" element={<AddUser />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;