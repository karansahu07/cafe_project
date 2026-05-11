import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadVendorProfile, updateShopProfileData } from './accountApi';

export default function ShopProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    store_name: '',
    store_address: '',
    business_reg_number: '',
    sin_code: ''
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await loadVendorProfile();
        setForm({
          store_name: profile?.store_name || '',
          store_address: profile?.store_address || '',
          business_reg_number: profile?.business_reg_number || '',
          sin_code: profile?.sin_code || ''
        });
        setPreview(profile?.store_image || profile?.profile_pic || '');
      } catch (err) {
        setError(err?.message || 'Unable to load store profile');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.store_name.trim() || !form.store_address.trim()) {
      setError('Please enter all required fields');
      return;
    }

    setSaving(true);
    try {
      await updateShopProfileData(form, selectedFile);
      window.alert('Store profile updated successfully');
      navigate('/my-account');
    } catch (err) {
      setError(err?.message || 'Unable to update store profile');
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
          <h4 className="mb-0">Shop Profile</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Back</Button>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <Form onSubmit={onSubmit}>
          <div className="mb-3 d-flex align-items-center gap-3">
            <img
              src={preview || 'https://via.placeholder.com/90?text=Shop'}
              alt="store"
              width={90}
              height={90}
              style={{ objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }}
            />
            <Form.Control type="file" accept="image/*" onChange={handleFile} />
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Store Name *</Form.Label>
                <Form.Control name="store_name" value={form.store_name} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Business Reg Number</Form.Label>
                <Form.Control name="business_reg_number" value={form.business_reg_number} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Store Address *</Form.Label>
                <Form.Control as="textarea" rows={2} name="store_address" value={form.store_address} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>SIN Code</Form.Label>
                <Form.Control name="sin_code" value={form.sin_code} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-3">
            <Button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update'}</Button>
            <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
