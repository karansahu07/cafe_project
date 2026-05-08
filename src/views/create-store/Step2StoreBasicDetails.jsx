import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getVendorTypesForSignup, vendorVerification } from "../../services/apiService";

const Step2StoreBasicDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vendorTypes, setVendorTypes] = useState([]);
  const [selectedVendorTypes, setSelectedVendorTypes] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formData, setFormData] = useState({
    store_name: "",
    business_reg_number: "",
    store_address: "",
    latitude: "",
    longitude: "",
  });
  const [storeImage, setStoreImage] = useState(null);

  useEffect(() => {
    const loadVendorTypes = async () => {
      const result = await getVendorTypesForSignup();
      if (result.success) {
        setVendorTypes(result.data || []);
      }
    };
    loadVendorTypes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendorTypeToggle = (id) => {
    setSelectedVendorTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => setError("Unable to fetch current location.")
    );
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.store_name.trim()) return setError("Enter store name");
    if (!storeImage) return setError("Please upload store image");
    if (!startTime) return setError("Please enter start time");
    if (!endTime) return setError("Please enter end time");
    if (!formData.business_reg_number.trim()) return setError("Enter business registration number");
    if (!formData.store_address.trim()) return setError("Enter store address");
    if (selectedVendorTypes.length === 0) return setError("Select vendor type");

    const userId = getUserIdFromToken();
    if (!userId) return setError("Vendor token missing. Please complete Step 1.");

    setLoading(true);

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("role_id", 3);
    payload.append("storename", formData.store_name.trim());
    payload.append("storeaddress", formData.store_address.trim());
    payload.append("vendor_start_time", startTime);
    payload.append("vendor_close_time", endTime);
    payload.append("business_reg_number", formData.business_reg_number.trim());
    payload.append("vendor_type_id", selectedVendorTypes.join(","));
    payload.append("vendor_lat", formData.latitude || 0);
    payload.append("vendor_lng", formData.longitude || 0);
    payload.append("store_image", storeImage);

    const result = await vendorVerification(payload);
    if (!result.success || result.data?.success === false) {
      setError(result.data?.message || result.error?.message || "Step 2 failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/create-store/step-3");
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "30px auto" }}>
      <Card className="borderless">
        <Card.Body>
          <h4 className="mb-4">Step 2: Store Basic Details</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Store Name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStoreImage(e.target.files?.[0] || null)}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  name="start_time"
                  placeholder="Start Time (HH:mm)"
                  inputMode="numeric"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  name="end_time"
                  placeholder="End Time (HH:mm)"
                  inputMode="numeric"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Business Registration Number"
                  name="business_reg_number"
                  value={formData.business_reg_number}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Store Address"
                  name="store_address"
                  value={formData.store_address}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className="mb-3">
              <Button variant="outline-secondary" type="button" onClick={handleLocation}>
                Use Current Location
              </Button>
            </div>

            <div className="mb-3">
              <div className="mb-2" style={{ fontWeight: 500 }}>
                Vendor Types
              </div>
              <Row>
                {vendorTypes.map((type) => (
                  <Col md={4} key={type.id || type._id} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`vendor-type-${type.id || type._id}`}
                      label={type.vendor_type}
                      checked={selectedVendorTypes.includes(type.id || type._id)}
                      onChange={() => handleVendorTypeToggle(type.id || type._id)}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Submitting..." : "Continue"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Step2StoreBasicDetails;
