import React, { useState, useEffect } from "react";
import { Card, Form, Button, InputGroup, Row, Col, Container, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserRegistration = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      role_id: "",
      phonenumber: "",
      password: "",
    });
    const [error, setError] = useState("");
    const [decodedToken, setDecodedToken] = useState(null);
    const [accessLevel, setAccessLevel] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for the popup

    const allowedRoles = accessLevel === "full" ? [1, 2, 3, 4] : 
                        accessLevel === "manager" ? [3,4] : 
                        accessLevel === "vendor" ? [4] : [];

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const updatedFormData = {
        ...formData,
        role_id: parseInt(formData.role_id, 10),
      };
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setDecodedToken(decoded);

          switch (decoded.role_id) {
            case 1:
              setAccessLevel("full");
              break;
            case 2:
              setAccessLevel("manager");
              break;
            case 3:
              setAccessLevel("vendor");
              break;
            default:
              setAccessLevel("none");
          }
        }

        const config = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        };

        const response = await axios.post(`${API_URL}/signup`, updatedFormData, config);
        // //console.log("User added successfully", response.data);
        
        // Show success modal
        setShowModal(true);

        // Clear form fields after successful submission
        setFormData({
          username: "",
          email: "",
          firstname: "",
          lastname: "",
          role_id: "",
          phonenumber: "",
          password: "",
        });
      } catch (err) {
        setError("Failed to add user. Please try again.");
      }
    };

    useEffect(() => {
      const loadToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          //console.log("Logged in user:", decoded.role);
          setDecodedToken(decoded);

          switch (decoded.role_id) {
            case 1:
              setAccessLevel("full");
              break;
            case 2:
              setAccessLevel("manager");
              break;
            case 3:
              setAccessLevel("vendor");
              break;
            default:
              setAccessLevel("none");
          }
        }
      };
      loadToken();
    }, []);

    return (
      <Container fluid className="p-4">
        <Card className="borderless w-100">
          <Card.Body>
            <h4 className="mb-3 f-w-400 text-center">Add User</h4>
            {error && <p className="text-danger text-center">{error}</p>}
            {accessLevel && (
              <p className="text-center">
                Access Level:{" "}
                {decodedToken?.role_id === 1
                  ? "SuperAdmin"
                  : decodedToken?.role_id === 2
                  ? "Manager"
                  : decodedToken?.role_id === 3
                  ? "Vendor"
                  : "Unknown"}
              </p>
            )}
            <Form onSubmit={handleSubmit} autoComplete="off">
              <Row>
                <Col md={6} className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FeatherIcon icon="user" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </InputGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FeatherIcon icon="mail" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </InputGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control
                    as="select"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  >
                    <option value="">Select Role</option>
                    {allowedRoles.includes(1) && <option value="1">Super Admin</option>}
                    {allowedRoles.includes(2) && <option value="2">Manager</option>}
                    {allowedRoles.includes(3) && <option value="3">Vendor</option>}
                    {allowedRoles.includes(4) && <option value="4">Delivery Partner</option>}
                  </Form.Control>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FeatherIcon icon="lock" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </InputGroup>
                </Col>
                <Col md={12} className="text-center">
                  <Button type="submit" className="btn btn-primary w-50">
                    Add User
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Success Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Created Successfully</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>The user has been added successfully!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setShowModal(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
};

export default UserRegistration;
