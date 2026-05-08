import React, { useState } from "react";
import { Card, Form, Button, Row, Col, InputGroup, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { jwtDecode } from "jwt-decode";
import { vendorSignup } from "../../services/apiService";

const Step1BasicVendorSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    dob: "",
    password: "",
    confirmPassword: "",
    prefix: "+1",
    role_id: 3,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.firstname.trim()) return setError("Enter first name");
    if (!formData.lastname.trim()) return setError("Enter last name");
    if (!formData.email.trim()) return setError("Enter email");
    if (!formData.phonenumber.trim()) return setError("Enter phone number");
    if (!formData.dob) return setError("Enter date of birth");
    if (!formData.password) return setError("Enter password");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    const payload = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      phonenumber: formData.phonenumber.trim(),
      dob: formData.dob,
      password: formData.password,
      role_id: 3,
      prefix: formData.prefix || "+1",
    };

    const result = await vendorSignup(payload);
    if (!result.success) {
      setError(result.error?.message || "Signup failed. Please try again.");
      setLoading(false);
      return;
    }

    const token = result.data?.token;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.user_id) {
          localStorage.setItem("user_id", decoded.user_id);
        }
        localStorage.setItem("vendor_ini_token", token);
        localStorage.setItem("user_token", token);
      } catch (err) {
        setError("Signup completed, but token could not be processed.");
      }
    }

    setLoading(false);
    navigate("/create-store/step-2");
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "30px auto" }}>
      <Card className="borderless">
        <Card.Body>
          <h4 className="mb-4">Step 1: Basic Vendor Signup</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row>
              <Col md={6} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FeatherIcon icon="user" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FeatherIcon icon="user" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
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
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FeatherIcon icon="phone" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Prefix"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                />
              </Col>
              <Col md={8} className="mb-3">
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Submitting..." : "Continue"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Step1BasicVendorSignup;
