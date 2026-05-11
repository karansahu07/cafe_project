import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadVendorProfile, updateVendorProfilePicture } from './account/accountApi';

const statItems = [
  { label: 'Balance & History', action: '/wallet' },
  { label: 'Orders', action: '/all-orders' },
  { label: 'Analytics Report', action: '/codeanalytics' }
];

const menuSections = [
  {
    title: 'Personal Info',
    items: [
      { label: 'Profile', to: '/edit-account' },
      { label: 'Change Password', to: '/changepassword' }
    ]
  },
  {
    title: 'Shop Details',
    items: [
      { label: 'Shop Profile', to: '/shopprofile' },
      { label: 'Shop Status', to: '/shopstatus' }
    ]
  },
  {
    title: 'History/Analytics',
    items: [
      { label: 'Orders', to: '/all-orders' },
      { label: 'Analytics', to: '/codeanalytics' }
    ]
  },
  {
    title: 'Wallet',
    items: [
      { label: 'Balance & History', to: '/wallet' },
      { label: 'Withdrawal History', to: '/withdrawals' }
    ]
  },
  {
    title: 'Banking Details',
    items: [
      { label: 'Bank Account Info', to: '/bankinfo' }
    ]
  }
];

export default function StoreMyAccount() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await loadVendorProfile();
      setProfile(data);
    } catch (err) {
      setError(err?.message || 'Unable to load account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const navigateSafe = (path) => {
    if (['/wallet', '/codeanalytics', '/withdrawals', '/balance'].includes(path)) {
      window.alert('This section will be enabled in next step.');
      return;
    }
    navigate(path);
  };

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ok = window.confirm('Are you sure you want to update this profile picture?');
    if (!ok) return;

    setUploading(true);
    setError('');
    try {
      await updateVendorProfilePicture(file);
      window.alert('Profile updated successfully');
      await loadProfile();
    } catch (err) {
      setError(err?.message || 'Unable to update profile picture');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
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
    <div className="p2" style={{ maxWidth: 980, margin: '0 auto' }}>
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h4 className="mb-1">My Account</h4>
              <div className="text-muted">Manage your vendor profile and store settings</div>
            </div>
            <Badge bg="warning" text="dark">4.5</Badge>
          </div>

          {error ? <div className="alert alert-danger py-2">{error}</div> : null}

          <div className="d-flex align-items-center gap-3">
            <img
              src={profile?.profile_pic || 'https://via.placeholder.com/84?text=Profile'}
              alt="profile"
              width={84}
              height={84}
              style={{ objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }}
            />
            <div className="flex-grow-1">
              <h5 className="mb-1">{profile?.store_name || 'Store Name'}</h5>
              <div className="text-muted">{profile?.custom_id || '-'}</div>
            </div>
            <div>
              <Button size="sm" onClick={onPickImage} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="d-none" />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-3">
        {statItems.map((item) => (
          <Col md={4} key={item.label}>
            <Card className="border-0 shadow-sm h-100" role="button" onClick={() => navigateSafe(item.action)}>
              <Card.Body>
                <strong>{item.label}</strong>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {menuSections.map((section) => (
        <Card className="border-0 shadow-sm mb-3" key={section.title}>
          <Card.Body>
            <h6 className="mb-2">{section.title}</h6>
            <ListGroup variant="flush">
              {section.items.map((item) => (
                <ListGroup.Item
                  key={item.label}
                  action
                  onClick={() => navigateSafe(item.to)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{item.label}</span>
                  <span>&gt;</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
