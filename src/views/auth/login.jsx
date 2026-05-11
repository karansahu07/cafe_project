import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from 'assets/images/logo1.svg';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../store/useAuth';
import { getHomeRouteFromRoleId, getResolvedRoleId } from '../../utils/authSession';
import { syncVendorFcmTokenOnLogin } from '../../services/firebase/firebaseMessaging';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignIn1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(getHomeRouteFromRoleId(getResolvedRoleId()));
    }
  }, [navigate]);

  const parseJsonSafe = async (response) => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  const extractToken = (data) => {
    return data?.token || data?.data?.token || data?.access_token || data?.accessToken || data?.jwt || null;
  };

  const saveSession = (token, resolvedUser, endpointType) => {
    localStorage.setItem('token', token);
    if (endpointType === 'vendor') {
      localStorage.setItem('vendor_ini_token', token);
      localStorage.setItem('user_token', token);
    }

    login(token, resolvedUser);

    if (resolvedUser?.role_id !== undefined && resolvedUser?.role_id !== null) {
      localStorage.setItem('role_id', String(resolvedUser.role_id));
    }
    if (resolvedUser?.role) {
      localStorage.setItem('role', resolvedUser.role);
    }
    if (resolvedUser?.username || resolvedUser?.name) {
      localStorage.setItem('username', resolvedUser.username || resolvedUser.name);
    }
    if (resolvedUser?.user_id || resolvedUser?.vendor_id || resolvedUser?.id) {
      localStorage.setItem('user_id', String(resolvedUser.user_id || resolvedUser.vendor_id || resolvedUser.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loginAttempts = [
      {
        type: 'admin',
        url: `${API_URL}/users/adminlogin`,
        payload: { email, password }
      },
      {
        type: 'vendor',
        url: `${API_URL}/vendors/vendor-login`,
        payload: { email, password, role_id: 3 }
      }
    ];

    let lastErrorMessage = 'Invalid credentials';

    try {
      for (const attempt of loginAttempts) {
        const response = await fetch(attempt.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attempt.payload)
        });

        const data = await parseJsonSafe(response);

        if (response.ok) {
          const token = extractToken(data);
          if (!token) {
            lastErrorMessage = 'Login response me token missing hai';
            continue;
          }

          let decoded = null;
          try {
            decoded = jwtDecode(token);
          } catch {
            decoded = null;
          }

          const roleId =
            decoded?.role_id ??
            data?.role_id ??
            data?.user?.role_id ??
            data?.vendor?.role_id ??
            (attempt.type === 'vendor' ? 3 : null);

          const role =
            decoded?.role ??
            data?.role ??
            data?.user?.role ??
            data?.vendor?.role ??
            (Number(roleId) === 3 ? 'vendor' : undefined);

          const username =
            decoded?.username ??
            data?.username ??
            data?.user?.username ??
            data?.user?.name ??
            data?.vendor?.username ??
            data?.vendor?.store_name;

          const resolvedUser = {
            ...(decoded || {}),
            role_id: roleId,
            role,
            username,
            user_id: decoded?.user_id ?? data?.vendor?.user_id ?? data?.user?.user_id ?? data?.user_id ?? data?.vendor?.vendor_id,
            vendor_id: decoded?.vendor_id ?? data?.vendor_id ?? data?.vendor?.vendor_id ?? data?.user?.vendor_id,
            id: decoded?.id ?? data?.id ?? data?.user?.id ?? data?.vendor?.id
          };

          saveSession(token, resolvedUser, attempt.type);

          if (Number(roleId) === 3) {
            const vendorUserId = resolvedUser?.user_id || resolvedUser?.vendor_id || resolvedUser?.id;
            console.log('[Login] Vendor detected, triggering FCM sync for user_id:', vendorUserId);
            syncVendorFcmTokenOnLogin({
              authToken: token,
              userId: vendorUserId
            }).catch((err) => {
              console.warn('[Login] FCM sync failed (non-blocking):', err?.message);
            });
          }

          navigate(getHomeRouteFromRoleId(roleId), { replace: true });
          return;
        }

        lastErrorMessage = data?.message || lastErrorMessage;
      }

      setError(lastErrorMessage);
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <img src={logoDark} alt="" className="img-fluid mb-4 mineimg" />
                <h4 className="mb-3 f-w-400">Signin</h4>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FeatherIcon icon="mail" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FeatherIcon icon="lock" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <Form.Group>
                    {/* <Form.Check type="checkbox" className="text-left mb-4 mt-2 minecheck" label="Save Credentials." defaultChecked /> */}
                  </Form.Group>
                  <Button type="submit" className="btn btn-block btn-primary mb-4" disabled={loading}>
                    {loading ? 'Signing in...' : 'Signin'}
                  </Button>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
