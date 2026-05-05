import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Breadcrumb as AntBreadcrumb, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { BASE_TITLE } from 'config/constant';

const { Title } = Typography;

export default function ModernBreadcrumb() {
  const location = useLocation();
  const { pathname } = location;

  // Split the pathname and filter out empty segments
  const pathSegments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      title: (
        <Link to="/dashboard" className="text-decoration-none text-muted">
          <HomeOutlined className="me-1" />
          Home
        </Link>
      ),
      path: '/dashboard',
    },
    ...pathSegments.map((segment, idx) => {
      // Build the path up to this segment
      const url = '/' + pathSegments.slice(0, idx + 1).join('/');
      // Capitalize segment for display
      const display = segment.charAt(0).toUpperCase() + segment.slice(1);
      return {
        title: idx === pathSegments.length - 1 ? (
          <span className="text-primary fw-medium">{display}</span>
        ) : (
          <Link to={url} className="text-decoration-none text-muted">{display}</Link>
        ),
        path: url,
      };
    })
  ];

  // Set document title to last segment or Home
  const lastSegment = pathSegments[pathSegments.length - 1];
  const title = lastSegment ? (lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)) : 'Home';
  document.title = title + BASE_TITLE;

  return (
    <div className="page-header">
      <div className="container-fluid">
        <div className="page-block">
          <Row className="align-items-center">
            <Col className='p-0' md={12}>
              <div className="page-header-content">
                <div className="d-flex align-items-center mt-2">
                  <Title level={3} className="mb-0 me-3 text-dark">
                    {title}
                  </Title>
                </div>
                <AntBreadcrumb
                  items={breadcrumbItems}
                  className="mb-0"
                  separator=">"
                  style={{ fontSize: '14px', color: '#6c757d' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

// Enhanced styles (add to your CSS file)
const breadcrumbStyles = `
.page-header {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.page-header .ant-breadcrumb {
  font-size: 13px;
}

.page-header .ant-breadcrumb-link {
  transition: all 0.2s ease;
}

.page-header .ant-breadcrumb-link:hover {
  color: #1890ff !important;
}

.page-header .btn {
  transition: all 0.2s ease;
  font-weight: 500;
}

.page-header .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.page-header .dropdown-menu {
  border-radius: 8px;
  padding: 8px 0;
}

.page-header .dropdown-item {
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.page-header .dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.page-header .badge {
  font-size: 11px;
  padding: 4px 8px;
}
`;

export { breadcrumbStyles };