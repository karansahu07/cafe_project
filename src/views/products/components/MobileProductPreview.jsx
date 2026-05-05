import React, { useState } from 'react';
import { Modal, Button, Card, Divider, Tag, Space, Image } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { formatPrice, calculateDiscountPercentage } from '../../../services/utils/gen_utility';

const MobileProductPreview = ({ 
  open, 
  onClose, 
  product, 
  BASE_URL 
}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Set initial selected image
  React.useEffect(() => {
    if (product.featured_image) {
      setSelectedImage(product.featured_image);
    }
  }, [product]);

  // Calculate current price
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return parseFloat(selectedVariant.price);
    }
    return calculateDiscountPercentage(product.price, product.discount_percent);
  };

  // Handle image selection
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      closable={false}
      centered
      width={400}
      bodyStyle={{ padding: 0, maxHeight: '90vh', overflowY: 'auto' }}
      style={{ top: 20 }}
      zIndex={2000}
    >
      {/* iPhone Frame */}
      <div style={{
        width: '100%',
        maxWidth: 375,
        height: 812,
        margin: '0 auto',
        background: '#000',
        borderRadius: 40,
        padding: 8,
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Phone Screen */}
        <div style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          borderRadius: 32,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Status Bar */}
          <div style={{
            height: 44,
            background: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            color: '#fff',
            fontSize: 14,
            fontWeight: '600'
          }}>
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 24, height: 12, border: '1px solid #fff', borderRadius: 6, position: 'relative' }}>
                <div style={{ width: '60%', height: '100%', background: '#fff', borderRadius: 5 }}></div>
              </div>
              <span>100%</span>
            </div>
          </div>

          {/* Header */}
          <div style={{
            height: 60,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onClose}
              style={{ fontSize: 18 }}
            />
            <div style={{ fontSize: 18, fontWeight: '600' }}>Product</div>
            <Space>
              <Button type="text" icon={<ShareAltOutlined />} />
              <Button type="text" icon={<MoreOutlined />} />
            </Space>
          </div>

          {/* Main Content */}
          <div style={{ height: 'calc(100% - 104px)', overflowY: 'auto' }}>
            {/* Product Image */}
            <div style={{ position: 'relative', height: 300 }}>
              <Image
                src={selectedImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
              
              {/* Image Gallery Dots */}
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 8
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: selectedImage === product.featured_image ? '#fff' : 'rgba(255,255,255,0.5)'
                  }}></div>
                  {product.gallery_images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: selectedImage === img.image_path ? '#fff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleImageClick(img.image_path)}
                    ></div>
                  ))}
                </div>
              )}

              {/* Favorite Button */}
              <Button
                type="text"
                icon={<HeartOutlined />}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>

            {/* Product Info */}
            <div style={{ padding: '20px 16px' }}>
              {/* Product Name */}
              <h1 style={{
                fontSize: 24,
                fontWeight: '700',
                margin: '0 0 8px 0',
                color: '#1a1a1a',
                lineHeight: 1.2
              }}>
                {product.name}
              </h1>

              {/* Description */}
              <p style={{
                fontSize: 14,
                color: '#666',
                margin: '0 0 16px 0',
                lineHeight: 1.4
              }}>
                {product.description}
              </p>

              {/* Price Section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: '#52c41a'
                  }}>
                    {formatPrice(getCurrentPrice())}
                  </span>
                  {product.discount_percent > 0 && (
                    <span style={{
                      fontSize: 16,
                      color: '#999',
                      textDecoration: 'line-through'
                    }}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                {/* Discount Badge */}
                {product.discount_percent > 0 && (
                  <Tag color="red" style={{ marginBottom: 8 }}>
                    {product.discount_percent}% OFF
                  </Tag>
                )}

                {/* Features */}
                <Space wrap style={{ marginBottom: 16 }}>
                  {product.is_featured === 1 && (
                    <Tag color="gold" icon={<StarOutlined />}>Featured</Tag>
                  )}
                  {product.is_today_deal === 1 && (
                    <Tag color="red">Today's Deal</Tag>
                  )}
                  {product.fast_delivery_available === 1 && (
                    <Tag color="green">Fast Delivery</Tag>
                  )}
                </Space>
              </div>

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: '600',
                    margin: '0 0 12px 0'
                  }}>
                    Variants
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {product.variants.map((variant, index) => (
                      <Tag
                        key={variant.id || index}
                        color={selectedVariant?.id === variant.id ? "blue" : "default"}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                        onClick={() => handleVariantSelect(variant)}
                      >
                        {variant.type}: {variant.value} - {formatPrice(variant.price)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {product.addons && product.addons.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: '600',
                    margin: '0 0 12px 0'
                  }}>
                    Add-ons
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {product.addons.map((addon, index) => (
                      <Tag key={index} color="purple" style={{ padding: '8px 12px', fontSize: 14 }}>
                        {addon.name} - {formatPrice(addon.price)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div style={{
                background: '#f8f9fa',
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircleOutlined style={{ color: product.stock > 0 ? '#52c41a' : '#ff4d4f' }} />
                <span style={{ fontSize: 14 }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Category and Brand */}
              <div style={{
                background: '#f8f9fa',
                padding: 12,
                borderRadius: 8,
                marginBottom: 20
              }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#666' }}>Category: </span>
                  <span style={{ fontSize: 14, fontWeight: '500' }}>
                    {product.category_name} {product.sub_category_name && `/ ${product.sub_category_name}`}
                  </span>
                </div>
                {product.brand_name && (
                  <div>
                    <span style={{ fontSize: 12, color: '#666' }}>Brand: </span>
                    <span style={{ fontSize: 14, fontWeight: '500' }}>{product.brand_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              overflow: 'hidden'
            }}>
              <Button
                type="text"
                style={{ border: 'none', borderRadius: 0 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span style={{
                padding: '8px 16px',
                borderLeft: '1px solid #d9d9d9',
                borderRight: '1px solid #d9d9d9',
                minWidth: 40,
                textAlign: 'center'
              }}>
                {quantity}
              </span>
              <Button
                type="text"
                style={{ border: 'none', borderRadius: 0 }}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={{
                flex: 1,
                height: 44,
                background: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              Add to Cart - {formatPrice(getCurrentPrice() * quantity)}
            </Button>
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 134,
          height: 5,
          background: '#fff',
          borderRadius: 3
        }}></div>
      </div>
    </Modal>
  );
};

export default MobileProductPreview;

