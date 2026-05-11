import { useMemo } from 'react';
import { Badge, Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useVendorNotifications from '../../hooks/useVendorNotifications';

export default function StoreNotifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications
  } = useVendorNotifications();

  const orderedNotifications = useMemo(
    () => notifications.filter((item) => !item?.read),
    [notifications]
  );

  const openNotification = (item) => {
    if (item?.order_id) {
      navigate(`/orders/${item.order_id}`);
    }
  };

  const handleMarkAsRead = async (event, item) => {
    event.stopPropagation();
    if (!item?.id) return;
    await markAsRead(item.id);
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Notifications ({unreadCount} unread)</h4>
          <Badge bg="danger">Unread: {unreadCount}</Badge>
        </div>

        <div className="d-flex gap-2 mb-3">
          <Button size="sm" variant="outline-danger" onClick={clearNotifications}>Clear all</Button>
        </div>

        {orderedNotifications.length === 0 ? (
          <p className="mb-0 text-muted">No notifications yet.</p>
        ) : (
          <ListGroup variant="flush">
            {orderedNotifications.map((item) => (
              <ListGroup.Item
                key={item.id}
                action
                onClick={() => openNotification(item)}
                className="d-flex justify-content-between align-items-start gap-3"
              >
                <div>
                  <div className="fw-semibold">{item.title || 'Notification'}</div>
                  <div className="small text-muted">{item.body || item.message || 'New update available.'}</div>
                  {item.order_id || item.order_uid ? (
                    <div className="small text-primary">Order: {item.order_uid || item.order_id}</div>
                  ) : null}
                  <div className="small text-muted">{new Date(item.createdAt || Date.now()).toLocaleString()}</div>
                  <div className="mt-2">
                    <Button size="sm" variant="outline-primary" onClick={(event) => handleMarkAsRead(event, item)}>
                      Mark as Read
                    </Button>
                  </div>
                </div>
                {!item.read ? <Badge bg="success">new</Badge> : null}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
