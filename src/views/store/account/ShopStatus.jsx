import { useEffect, useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadVendorProfile, updateShopStatusData } from './accountApi';

const toMinutes = (timeValue) => {
  const parts = String(timeValue || '').split(':');
  if (parts.length < 2) return null;
  const hours = Number(parts[0]);
  const mins = Number(parts[1]);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null;
  return hours * 60 + mins;
};

export default function ShopStatus() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(0);
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('22:00');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await loadVendorProfile();
        setStatus(Number(profile?.status || 0));
        setOpenTime(String(profile?.vendor_start_time || '10:00').slice(0, 5));
        setCloseTime(String(profile?.vendor_close_time || '22:00').slice(0, 5));
      } catch (err) {
        setError(err?.message || 'Unable to load shop status');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!openTime || !closeTime) {
      setError('Please select both times');
      return;
    }

    const start = toMinutes(openTime);
    const end = toMinutes(closeTime);
    if (start == null || end == null) {
      setError('Invalid time format');
      return;
    }
    if (start >= end) {
      setError('Opening time must be before closing time');
      return;
    }

    setSaving(true);
    try {
      await updateShopStatusData(status, openTime, closeTime);
      window.alert('Store hours updated successfully');
      navigate('/my-account');
    } catch (err) {
      setError(err?.message || 'Unable to update shop status');
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
          <h4 className="mb-0">Shop Status</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Back</Button>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Shop Status</Form.Label>
            <div>
              <Form.Check
                type="switch"
                id="shop-status-toggle"
                checked={status === 1}
                onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                label={status === 1 ? 'Online' : 'Offline'}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opening Time *</Form.Label>
            <Form.Control type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Closing Time *</Form.Label>
            <Form.Control type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
          </Form.Group>

          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
