import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadVendorProfile, updateVendorProfileData } from './accountApi';

export default function EditAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    storename: '',
    storeaddress: '',
    prefix: '',
    sincode: ''
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await loadVendorProfile();
        setForm({
          firstname: profile?.firstname || '',
          lastname: profile?.lastname || '',
          storename: profile?.store_name || '',
          storeaddress: profile?.store_address || '',
          prefix: profile?.prefix || '',
          sincode: profile?.sin_code || ''
        });
        setPreview(profile?.profile_pic || '');
      } catch (err) {
        setError(err?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const canSubmit = useMemo(() => {
    return form.firstname.trim().length > 0 && form.lastname.trim().length > 0;
  }, [form.firstname, form.lastname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('First name and last name are required');
      return;
    }

    setSaving(true);
    try {
      await updateVendorProfileData({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        storename: form.storename.trim(),
        storeaddress: form.storeaddress.trim(),
        sincode: form.sincode.trim(),
        prefix: form.prefix.trim(),
        worker_profilePic: selectedFile
      });
      window.alert('Profile updated successfully');
      navigate('/my-account');
    } catch (err) {
      setError(err?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Edit Account</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Back</Button>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <Form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center gap-3">
            <img
              src={preview || 'https://via.placeholder.com/90?text=User'}
              alt="profile"
              width={90}
              height={90}
              style={{ objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }}
            />
            <Form.Control type="file" accept="image/*" onChange={handleFile} />
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name *</Form.Label>
                <Form.Control name="firstname" value={form.firstname} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control name="lastname" value={form.lastname} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Store Name</Form.Label>
                <Form.Control name="storename" value={form.storename} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prefix</Form.Label>
                <Form.Control name="prefix" value={form.prefix} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Store Address</Form.Label>
                <Form.Control as="textarea" rows={2} name="storeaddress" value={form.storeaddress} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>SIN Code</Form.Label>
                <Form.Control name="sincode" value={form.sincode} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-3">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
