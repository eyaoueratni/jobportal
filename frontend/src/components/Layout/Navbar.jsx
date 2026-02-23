import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout");
      toast.success(response.data.message);

      // Clear user state and authorization status
      setIsAuthorized(false);
      setUser(null);

      // Clear local storage
      localStorage.clear();

      // Redirect to login page
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  let linkText;
  if (user && user.role === "Employer") {
    linkText = "APPLICANT'S APPLICATIONS";
  } else if (user && user.role === "Job Seeker") {
    linkText = "MY APPLICATIONS";
  } 

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
         
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          {isAuthorized ? (
            <>
              <li>
                <Link to="/" onClick={() => setShow(false)}>
                  HOME
                </Link>
              </li>
              {user && user.role === "Admin" && (
                <>
                  <li>
                    <Link to="/employer" onClick={() => setShow(false)}>
                      Employer
                    </Link>
                  </li>
                  <li>
                    <Link to="/user" onClick={() => setShow(false)}>
                      Job Seeker
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/job/getall" onClick={() => setShow(false)}>
                  ALL JOBS
                </Link>
              </li>
              <li>
                <Link to="/applications/me" onClick={() => setShow(false)}>
                  {linkText}
                </Link>
              </li>
              {user && user.role === "Employer" && (
                <>
                  <li>
                    <Link to="/job/post" onClick={() => setShow(false)}>
                      POST NEW JOB
                    </Link>
                  </li>
                  <li>
                    <Link to="/job/me" onClick={() => setShow(false)}>
                      VIEW YOUR JOBS
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout}>LOGOUT</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setShow(false)}>
                LOGIN
              </Link>
            </li>
          )}
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
