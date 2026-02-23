import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "", // Initially empty to prompt selection
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data: ", formData); // Log data before sending
      const response = await axios.post("http://localhost:2022/api/user/createuser", formData, {
        withCredentials: true,
      });
      console.log("Response: ", response); // Log the response
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Error response data: ", error.response.data);
      } else {
        console.error("Error: ", error.message);
      }
    }
  };
  
  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>ADD  new user</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="inputTag">
              <label>Register As</label>
              <div>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
              </div>
            </div>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Last Name</label>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input
                  type="number"
                  name="phone"
                  placeholder="12345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit"  onClick={handleSubmit}>
              Register
            </button>
            
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default AddUser;
