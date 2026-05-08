import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ApplicationReview = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ maxWidth: 700, margin: "40px auto" }}>
      <Card className="borderless">
        <Card.Body style={{ textAlign: "center" }}>
          <h4 className="mb-3">Application Under Review</h4>
          <p className="mb-4">
            Your store application has been submitted. Our team will review your details and get back to you soon.
          </p>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplicationReview;
