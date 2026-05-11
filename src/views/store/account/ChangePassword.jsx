import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { changeVendorPassword } from './accountApi';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState({ old: false, next: false, confirm: false });
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return 'Please enter all required fields';
    }
    if (form.newPassword.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (form.newPassword !== form.confirmPassword) {
      return 'New Password and Confirm Password must match';
    }
    if (form.newPassword === form.oldPassword) {
      return 'New password must be different from old password';
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
      await changeVendorPassword(form.oldPassword, form.newPassword);
      window.alert('Password changed successfully');
      navigate('/my-account');
    } catch (err) {
      setError(err?.message || 'Unable to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Change Password</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/my-account')}>Back</Button>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password *</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type={show.old ? 'text' : 'password'}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
              />
              <Button variant="outline-secondary" onClick={() => setShow((p) => ({ ...p, old: !p.old }))}>
                {show.old ? 'Hide' : 'Show'}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password *</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type={show.next ? 'text' : 'password'}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
              <Button variant="outline-secondary" onClick={() => setShow((p) => ({ ...p, next: !p.next }))}>
                {show.next ? 'Hide' : 'Show'}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password *</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type={show.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <Button variant="outline-secondary" onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}>
                {show.confirm ? 'Hide' : 'Show'}
              </Button>
            </div>
          </Form.Group>

          <Button type="submit" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
