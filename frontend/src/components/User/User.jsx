import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:2022/api/user/getalljobseeker", {
          withCredentials: true,
        });
        setUsers(res.data.employers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:2022/api/user/deleteuser/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((employer) => employer._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (userId) => {
    navigateTo(`/edituser/${userId}`);
  };

  const handleAddUser = () => {
    navigateTo("/adduser");
  };

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL JOB SEEKERS </h1>
        <div className="banner">
          {users.length > 0 ? (
            <table className="employers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((employer) => (
                  <tr key={employer._id}>
                    <td>{employer.name}</td>
                    <td>{employer.email}</td>
                    <td>{employer.role}</td>
                    <td>
                      <button className="edit_btn"onClick={() => handleEdit(employer._id)}>Edit</button>
                    </td>
                    <td>
                      <button className="delete_btn" onClick={() => handleDelete(employer._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No employers found.</p>
          )}
        </div>
        <button onClick={handleAddUser} className="add-user-button">Add New User</button>
      </div>
    </section>
  );
};

export default Users;
