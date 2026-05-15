import { useMemo } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Form, Badge, Button } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';
import useVendorNotifications from '../../../../hooks/useVendorNotifications';

// assets
import logo from 'assets/images/logo.svg';
import { useNavigate } from "react-router-dom";

// -----------------------|| NAV RIGHT ||-----------------------//

export default function NavRight() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const {
    isVendor,
    permission,
    tokenStatus,
    error,
    notifications,
    unreadCount,
    requestPermission,
    retryTokenRegistration,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    unregisterDeviceToken
  } = useVendorNotifications();

  const latestNotifications = useMemo(() => notifications.slice(0, 8), [notifications]);

  const handleNotificationClick = (item) => {
    if (!item?.id) return;
    markAsRead(item.id);

    if (item?.order_id) {
      navigate(`/orders/${item.order_id}`);
      return;
    }

    navigate('/all-orders');
  };

  const handleLogout = async () => {
    await unregisterDeviceToken();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <ListGroup as="ul" bsPrefix=" " className="list-unstyled">
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
            <Form className="px-3">
              <div className="form-group mb-0 d-flex align-items-center">
                <FeatherIcon icon="search" />
                <Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>

      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown align="end">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0">
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <FeatherIcon icon="bell" />
              {unreadCount > 0 ? (
                <Badge
                  bg="danger"
                  pill
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    fontSize: '10px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}
                >
                  {unreadCount}
                </Badge>
              ) : null}
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown" style={{ width: 360, maxWidth: '90vw' }}>
            <div className="px-3 pt-2 pb-2 d-flex justify-content-between align-items-center">
              <strong>Notifications</strong>
              <div className="d-flex gap-2">
                <Button variant="link" size="sm" className="p-0" onClick={markAllAsRead}>Mark read</Button>
                <Button variant="link" size="sm" className="p-0 text-danger" onClick={clearNotifications}>Clear</Button>
              </div>
            </div>

            {isVendor && permission === 'denied' ? (
              <div className="px-3 pb-2 text-warning small">Notifications permission denied. Enable it in browser settings.</div>
            ) : null}
            {isVendor && permission !== 'granted' && permission !== 'denied' ? (
              <div className="px-3 pb-2">
                <Button size="sm" onClick={requestPermission}>Enable Notifications</Button>
              </div>
            ) : null}
            {isVendor && tokenStatus === 'error' ? (
              <div className="px-3 pb-2">
                <div className="small text-danger mb-1">{error || 'Notification token setup failed.'}</div>
                <Button size="sm" variant="outline-primary" onClick={retryTokenRegistration}>Retry</Button>
              </div>
            ) : null}

            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {latestNotifications.length === 0 ? (
                <div className="px-3 py-3 text-muted small">No notifications yet</div>
              ) : (
                latestNotifications.map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => handleNotificationClick(item)} className="notification-item">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <div className="fw-semibold">{item.title || 'Notification'}</div>
                        <div className="small text-muted">{item.body}</div>
                        {item.order_uid || item.order_id ? (
                          <div className="small text-primary">Order: {item.order_uid || item.order_id}</div>
                        ) : null}
                        <div className="small text-muted">{new Date(item.createdAt || Date.now()).toLocaleString()}</div>
                      </div>
                      {!item.read ? <Badge bg="success">new</Badge> : null}
                    </div>
                  </Dropdown.Item>
                ))
              )}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>

      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown className="drp-user">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
            <img src={logo} alt="userimage" className="user-avatar" />
            <span>
              <span className="user-name">{username}</span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
            <Dropdown.Header className="pro-head">
            </Dropdown.Header>
            <Link to="#" className="dropdown-item" onClick={handleLogout}>
              <i className="material-icons-two-tone">chrome_reader_mode</i> Logout
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
    </ListGroup>
  );
}