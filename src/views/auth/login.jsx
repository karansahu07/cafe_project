import { NavLink } from 'react-router-dom';
import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoDark from 'assets/images/logo1.svg';
import { jwtDecode } from "jwt-decode";
import useAuth from '../../store/useAuth';

// Access environment variable properly
const API_URL = import.meta.env.VITE_API_URL;

export default function SignIn1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = useAuth((state) => state.login); // 👈 hook se login function nikala


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${API_URL}/users/adminlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(response)
      const data = await response.json();

      if (response.ok) {
        // Save token if needed
        const token=data.token
        if(token){
          localStorage.setItem("token", data.token);
          const decoded = jwtDecode(token);
          console.log("logged in user:",decoded)
          login(token, decoded);    
          console.log("useAuth")
          localStorage.setItem("role_id", decoded.role_id);
          localStorage.setItem("role", decoded.role);
          localStorage.setItem("username", decoded.username);
        }
        else{
          //console.log("token is not defined");
        }
        navigate("/dashboard"); // Redirect to dashboard
        window.location.reload();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <img src={logoDark} alt="" className="img-fluid mb-4 mineimg" />
                <h4 className="mb-3 f-w-400">Signin</h4>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FeatherIcon icon="mail" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FeatherIcon icon="lock" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <Form.Group>
                    {/* <Form.Check type="checkbox" className="text-left mb-4 mt-2 minecheck" label="Save Credentials." defaultChecked /> */}
                  </Form.Group>
                  <Button type="submit" className="btn btn-block btn-primary mb-4">
                    Signin
                  </Button>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
