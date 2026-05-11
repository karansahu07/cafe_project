import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadBankDetails, saveBankDetails } from './accountApi';

export default function BankInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    bank_name: '',
    account_holder_name: '',
    transit_number: '',
    institution_number: '',
    account_number: ''
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const bank = await loadBankDetails();
        setForm({
          bank_name: bank?.bank_name || '',
          account_holder_name: bank?.account_holder_name || '',
          transit_number: bank?.transit_number || '',
          institution_number: bank?.institution_number || '',
          account_number: bank?.account_number || ''
        });
      } catch (err) {
        setError(err?.message || 'Unable to load bank details');
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

  const validate = () => {
    if (!form.bank_name || !form.account_holder_name || !form.transit_number || !form.institution_number || !form.account_number) {
      return 'Please fill all required fields';
    }
    if (!/^\d{5}$/.test(form.transit_number)) {
      return 'Transit number must be 5 digits';
    }
    if (!/^\d{3}$/.test(form.institution_number)) {
      return 'Institution number must be 3 digits';
    }
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextError = validate();
    setError(nextError);
    if (nextError) return;

    setSaving(true);
    try {
      await saveBankDetails(form);
      window.alert('Bank details saved successfully');
      navigate('/my-account');
    } catch (err) {
      setError(err?.message || 'Unable to save bank details');
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
          <h4 className="mb-0">Bank Information</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Back</Button>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <Form onSubmit={onSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Bank Name *</Form.Label>
                <Form.Control name="bank_name" value={form.bank_name} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Account Holder *</Form.Label>
                <Form.Control name="account_holder_name" value={form.account_holder_name} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Transit Number *</Form.Label>
                <Form.Control name="transit_number" value={form.transit_number} onChange={handleChange} maxLength={5} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Institution Number *</Form.Label>
                <Form.Control name="institution_number" value={form.institution_number} onChange={handleChange} maxLength={3} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Account Number *</Form.Label>
                <Form.Control name="account_number" value={form.account_number} onChange={handleChange} />
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
