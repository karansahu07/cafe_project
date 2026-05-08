import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { storeAdditionalDetails } from "../../services/apiService";

const Step4AdditionalCertificates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState({
    food_certificate: null,
    health_inspection_certificate: null,
    vendor_insurance_certificate: null,
  });
  const maxFileSize = 2 * 1024 * 1024;
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("vendor_ini_token") || localStorage.getItem("user_token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded?.user_id || null;
    } catch (err) {
      return null;
    }
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setFiles((prev) => ({ ...prev, [field]: null }));
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF or JPG/PNG files are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > maxFileSize) {
      setError("File size must be under 2 MB.");
      event.target.value = "";
      return;
    }
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!files.food_certificate) return setError("Upload food certificate");
    if (!files.health_inspection_certificate) return setError("Upload health inspection certificate");
    if (!files.vendor_insurance_certificate) return setError("Upload vendor insurance certificate");

    const userId = getUserIdFromToken();
    if (!userId) return setError("Vendor token missing. Please complete Step 1.");

    setLoading(true);

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("food_certificate", files.food_certificate);
    payload.append("health_inspection_certificate", files.health_inspection_certificate);
    payload.append("vendor_insurance_certificate", files.vendor_insurance_certificate);

    const result = await storeAdditionalDetails(payload);
    if (!result.success || result.data?.success === false) {
      setError(result.data?.message || result.error?.message || "Step 4 failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/create-store/step-5");
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "30px auto" }}>
      <Card className="borderless">
        <Card.Body>
          <h4 className="mb-4">Step 4: Additional Certificates</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Food Certificate</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "food_certificate")}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Health Inspection Certificate</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "health_inspection_certificate")}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Vendor Insurance Certificate</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "vendor_insurance_certificate")}
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

export default Step4AdditionalCertificates;
