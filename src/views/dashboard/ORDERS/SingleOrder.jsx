import React from 'react';
import { Card, Button, Table, Row, Col, Avatar, Tag, Image as AntImage, Divider } from 'antd';
import {
  User as UserIcon,
  Store as StoreIcon,
  Bike as BikeIcon,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  ShoppingCart,
  Image as LucideImage,
  ArrowLeft,
  Hash,
  BadgeCheck,
} from 'lucide-react';
import { getOrderStatus } from './hooks/useOrder';

const labelStyle = { fontWeight: 600, color: '#555' };
const valueStyle = { color: '#222' };
const fieldRowStyle = { display: 'flex', alignItems: 'center', marginBottom: 6 };
const labelFixedStyle = { width: 120, fontWeight: 600, color: '#555' };
const valueFlexStyle = { flex: 1, color: '#222' };
const imgBase = import.meta.env.VITE_IMAGE_BASE_URL || '';

const sectionTitle = (icon, text) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
    {icon}
    <span>{text}</span>
  </div>
);

const SingleOrder = ({ order, onBack }) => {
  if (!order) {
    return (
      <Card style={{ maxWidth: 900, margin: '0 auto', marginTop: 24 }}>
        <p>No order details found.</p>
        <Button onClick={onBack}>Go Back</Button>
      </Card>
    );
  }

  const addressType = (type) => {
    if (type === 1) return 'Home';
    if (type === 2) return 'Work';
    return 'Other';
  };

  // Price breakdown logic
  const subtotal = (order.products || []).reduce((sum, p) => sum + Number(p.total_item_price || 0), 0);
  const pickupCharges = Number(order.pickup_charges || 0);
  const discount = Number(order.discounted_price || 0);
  const total = Number(order.total_price || 0);

  const productColumns = [
    {
      title: <span><LucideImage size={16} style={{ marginRight: 4 }} />Image</span>,
      dataIndex: 'featured_image',
      render: (img) => img ? (
        <AntImage src={imgBase + img} alt="Product" width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />
      ) : <div style={{ width: 60, height: 60, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LucideImage size={24} color="#bbb" /></div>,
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      render: (name, record) => (
        <div>
          <b>{name}</b>
          <div style={{ fontSize: 12, color: '#888' }}>Size: {record.product_size}</div>
        </div>
      ),
    },
    // {
    //   title: 'Gallery',
    //   dataIndex: 'gallery_images',
    //   render: (gallery) => (
    //     <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
    //       {Array.isArray(gallery) && gallery.map((img, idx) => (
    //         <AntImage key={idx} src={imgBase + img} alt="Gallery" width={32} height={32} style={{ objectFit: 'cover', borderRadius: 4 }} preview={false} />
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: 'Quantity',
      dataIndex: 'product_quantity',
      align: 'center',
      render: (qty) => <Tag color="blue">{qty}</Tag>,
    },
    {
      title: 'Per Unit Price',
      dataIndex: 'single_item_price',
      align: 'right',
      render: (price) => <span><IndianRupee size={14} style={{ marginRight: 2 }} />{price}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'total_item_price',
      align: 'right',
      render: (price) => <span style={{ fontWeight: 600, color: '#389e0d' }}><IndianRupee size={14} style={{ marginRight: 2 }} />{price}</span>,
    },
  ];

  const status = getOrderStatus(order.order_status);

  return (
    <div style={{ margin: '0 auto', marginTop: 24, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px #0001',
        marginBottom: 16,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        minHeight: 64,
      }}>
        <Button icon={<ArrowLeft size={18} />} onClick={onBack} type="default" style={{ fontWeight: 600 }}>
          Back
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BadgeCheck size={20} color={status.color} />
          <Tag color={status.color} style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{status.text}</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#555' }}>
          <Hash size={18} />
          <span>Order ID: {order.order_id}</span>
        </div>
      </div>
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto',overflowX:"hidden", paddingRight: 2 }}>
        {/* Customer & Vendor */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', height: '100%' }}>
              {sectionTitle(<UserIcon size={20} />, 'Customer Details')}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <Avatar size={64} icon={<UserIcon size={32} />} style={{ background: '#e6f7ff' }} />
                <div style={{ flex: 1 }}>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Name:</span><span style={valueFlexStyle}>{order.user?.firstname || ''} {order.user?.lastname || ''}</span></div>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Phone:</span><span style={valueFlexStyle}>{order.user?.prefix} {order.user?.phonenumber}</span></div>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Email:</span><span style={valueFlexStyle}>{order.user?.email || '-'}</span></div>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Address:</span><span style={valueFlexStyle}>{order.address?.address || '-'} (Type: {addressType(order.address?.type)})</span></div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', height: '100%' }}>
              {sectionTitle(<StoreIcon size={20} />, 'Vendor Details')}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <Avatar size={64} icon={<StoreIcon size={32} />} style={{ background: '#fffbe6', color: '#faad14' }} />
                <div style={{ flex: 1 }}>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Vendor:</span><span style={valueFlexStyle}>{order.vendor?.store_name}</span></div>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Vendor ID:</span><span style={valueFlexStyle}>{order.vendor?.custom_id}</span></div>
                  <div style={fieldRowStyle}><span style={labelFixedStyle}>Store Address:</span><span style={valueFlexStyle}>{order.vendor?.store_address}</span></div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Order Products Table */}
        <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} /> Order Products
          </div>
          <Table columns={productColumns} dataSource={order.products || []} rowKey={(item, idx) => idx} pagination={false} scroll={{ x: true }} />
        </Card>

        {/* Rider & Price Breakdown Side by Side */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', height: '100%' }}>
              {sectionTitle(<BikeIcon size={20} />, 'Rider Details')}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <Avatar size={64} icon={<BikeIcon size={32} />} style={{ background: '#f0f5ff', color: '#2f54eb' }} />
                <div style={{ flex: 1,display:"flex",flexDirection:"row" }}>
                  <div style={{flex:1}}>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Rider Name:</span><span style={valueFlexStyle}>{order.rider?.firstname || ''} {order.rider?.lastname || ''}</span></div>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Rider ID:</span><span style={valueFlexStyle}>{order.rider?.custom_id}</span></div>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Contact:</span><span style={valueFlexStyle}>-</span></div>
                  </div>
                  <div>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Pickup:</span><span style={valueFlexStyle}>{order.vendor?.store_address}</span></div>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Delivery:</span><span style={valueFlexStyle}>{order.address?.address}</span></div>
                    <div style={fieldRowStyle}><span style={labelFixedStyle}>Time:</span><span style={valueFlexStyle}>-</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', height: '100%' }}>
              {sectionTitle(<IndianRupee size={20} />, 'Price Details')}
              <div style={{ padding: 8 }}>
                <div style={{ ...fieldRowStyle, fontSize: 16 }}>
                  <span style={labelFixedStyle}>Subtotal:</span>
                  <span style={valueFlexStyle}><IndianRupee size={14} style={{ marginRight: 2 }} />{subtotal.toFixed(2)}</span>
                </div>
                {pickupCharges > 0 && (
                  <div style={{ ...fieldRowStyle, fontSize: 16 }}>
                    <span style={labelFixedStyle}>Pickup Charges:</span>
                    <span style={valueFlexStyle}><IndianRupee size={14} style={{ marginRight: 2 }} />{pickupCharges.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div style={{ ...fieldRowStyle, fontSize: 16 }}>
                    <span style={labelFixedStyle}>Discount:</span>
                    <span style={{ ...valueFlexStyle, color: 'red' }}>-<IndianRupee size={14} style={{ marginRight: 2 }} />{discount.toFixed(2)}</span>
                  </div>
                )}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ ...fieldRowStyle, fontSize: 20, fontWeight: 700, color: '#389e0d' }}>
                  <span style={labelFixedStyle}>Total:</span>
                  <span style={valueFlexStyle}><IndianRupee size={18} style={{ marginRight: 2 }} />{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SingleOrder;
