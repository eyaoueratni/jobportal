import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:2022/api/user/getuser/${id}`, {
          withCredentials: true,
        });
        const userData = response.data.user;
        setFormData({
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          password: "", // Avoid prepopulating password for security reasons
          role: userData.role,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data: ", formData);
      const response = await axios.put(`http://localhost:2022/api/user/updateuser/${id}`, formData, {
        withCredentials: true,
      });
      console.log("Response: ", response);
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
    <section className="authPage">
      <div className="container">
        <div className="header">
          <h3>Edit User</h3>
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
          <button type="submit">
            Update
          </button>
        </form>
      </div>
      <div className="banner">
        <img src="/login.png" alt="login" />
      </div>
    </section>
  );
};

export default EditUser;
