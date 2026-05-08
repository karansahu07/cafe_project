import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { addBankDetails } from "../../services/apiService";

const Step5BankDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    bank_name: "",
    account_holder_name: "",
    transit_number: "",
    institution_number: "",
    account_number: "",
  });
  const [voidCheque, setVoidCheque] = useState(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.bank_name.trim()) return setError("Enter bank name");
    if (!formData.account_holder_name.trim()) return setError("Enter account holder name");
    if (!formData.transit_number.trim()) return setError("Enter transit number");
    if (!formData.institution_number.trim()) return setError("Enter institution number");
    if (!formData.account_number.trim()) return setError("Enter account number");
    if (!voidCheque) return setError("Upload void cheque");

    const userId = getUserIdFromToken();
    if (!userId) return setError("Vendor token missing. Please complete Step 1.");

    setLoading(true);

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("role_id", "3");
    payload.append("bank_name", formData.bank_name.trim());
    payload.append("account_holder_name", formData.account_holder_name.trim());
    payload.append("transit_number", formData.transit_number.trim());
    payload.append("institution_number", formData.institution_number.trim());
    payload.append("account_number", formData.account_number.trim());
    payload.append("void_cheque", voidCheque);

    const result = await addBankDetails(payload);
    if (!result.success || result.data?.success === false) {
      setError(result.data?.message || result.error?.message || "Step 5 failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/application-review");
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "30px auto" }}>
      <Card className="borderless">
        <Card.Body>
          <h4 className="mb-4">Step 5: Bank Details</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Bank Name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Account Holder Name"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Transit Number"
                  name="transit_number"
                  value={formData.transit_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Institution Number"
                  name="institution_number"
                  value={formData.institution_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Account Number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Void Cheque</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setVoidCheque(e.target.files?.[0] || null)}
                />
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Step5BankDetails;
