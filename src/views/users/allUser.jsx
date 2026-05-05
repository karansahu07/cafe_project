import React, { useState, useEffect } from "react";
import { Table, Container, Form } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userRoleId = decoded?.role_id || 0;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (token) {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const response = await axios.get(`${API_URL}/users/fetchuser`, config);
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, [API_URL, token]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    if (role === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role_id === parseInt(role, 10)));
    }
  };

  // Define role-based dropdown visibility
  const getAvailableRoles = () => {
    switch (userRoleId) {
      case 1: // Super Admin can see all roles
        return [
          { id: "", name: "All Roles" },
          { id: "1", name: "Super Admin" },
          { id: "2", name: "Manager" },
          { id: "3", name: "Vendor" },
          { id: "4", name: "Delivery Partner" },
        ];
      case 2: // Manager can see all except Super Admin
        return [
          { id: "", name: "All Roles" },
          { id: "3", name: "Vendor" },
          { id: "4", name: "Delivery Partner" },
        ];
      case 3: // Vendor can see Vendor and Delivery Partner
        return [
          { id: "4", name: "Delivery Partner" },
        ];
      default: // Others see only their own role
        return [{ id: String(userRoleId), name: "Your Role" }];
    }
  };

  return (
    <Container fluid className="p-4">
      {error && <p className="text-danger text-center">{error}</p>}
      <Form.Group controlId="roleFilter" className="mb-3">
        <Form.Label>Filter by Role</Form.Label>
        <Form.Control as="select" value={selectedRole} onChange={handleRoleChange}>
          {getAvailableRoles().map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className="table-responsive p-2 bg-white">
      <Table >
        <thead>
          <tr>
            <th>#</th> {/* Serial Number Column */}
            <th>Username</th>
            <th>Email</th>
            <th>Role Name</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.username}>
              <td>{index + 1}</td> {/* Serial Number */}
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role_name}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.phonenumber}</td>

            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </Container>
  );
};

export default UserList;
