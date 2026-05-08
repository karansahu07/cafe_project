import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { storeBusinessDetails } from "../../services/apiService";

const Step3BusinessDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    business_license_number: "",
    gst_number: "",
  });
  const [files, setFiles] = useState({
    profile_pic: null,
    business_license_pic: null,
    gst_pic: null,
    other_doc: null,
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.business_license_number.trim()) return setError("Enter business license number");
    if (!formData.gst_number.trim()) return setError("Enter GST/HST number");
    if (!files.profile_pic) return setError("Upload profile picture");
    if (!files.business_license_pic) return setError("Upload business license image");
    if (!files.gst_pic) return setError("Upload GST/HST image");

    const userId = getUserIdFromToken();
    if (!userId) return setError("Vendor token missing. Please complete Step 1.");

    setLoading(true);

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("business_reg_number", formData.business_license_number.trim());
    payload.append("business_license_number", formData.business_license_number.trim());
    payload.append("gst_number", formData.gst_number.trim());
    payload.append("profile_pic", files.profile_pic);
    payload.append("bussiness_license_number_pic", files.business_license_pic);
    payload.append("gst_number_pic", files.gst_pic);
    if (files.other_doc) {
      payload.append("other_doc", files.other_doc);
    }

    const result = await storeBusinessDetails(payload);
    if (!result.success || result.data?.success === false) {
      setError(result.data?.message || result.error?.message || "Step 3 failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/create-store/step-4");
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "30px auto" }}>
      <Card className="borderless">
        <Card.Body>
          <h4 className="mb-4">Step 3: Business Details + Documents</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Business License Number"
                  name="business_license_number"
                  value={formData.business_license_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="GST/HST Number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile_pic")}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Business License Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "business_license_pic")}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>GST/HST Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "gst_pic")}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Other Document (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "other_doc")}
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

export default Step3BusinessDetails;
