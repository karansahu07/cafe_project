import React from 'react';
import { Modal, Button, Card, Divider } from 'antd';
import { Grid } from 'antd';
import { formatPrice } from '../../../services/utils/gen_utility';

const { useBreakpoint } = Grid;

const ProductPreview = ({ 
  open, 
  onClose, 
  product, 
  BASE_URL 
}) => {
  const screens = useBreakpoint();

  if (!product) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      closable={false}    // 👈 this will hide the top-right close button

      centered
      width={screens.md ? 1200 : 360}
      bodyStyle={{ padding: 0, maxHeight: '90vh', overflowY: 'auto' }}
      style={{ top: 20 }}
      zIndex={2000}
    >
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header with close button */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Product Preview</h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Detailed product information</p>
          </div>
          <Button 
            type="text" 
            icon={<span style={{ color: 'white', fontSize: '20px' }}>✕</span>} 
            onClick={onClose}
            style={{ color: 'white', border: 'none' }}
          />
        </div>

        {/* Main Content */}
        <div style={{ padding: '32px 24px' }}>
          <div style={{ display: 'flex', flexDirection: screens.md ? 'row' : 'column', gap: 40, alignItems: screens.md ? 'flex-start' : 'center' }}>
            
            {/* Left Column - Images */}
            <div style={{ 
              minWidth: screens.md ? 400 : '100%', 
              maxWidth: screens.md ? 400 : '100%',
              background: '#fafafa',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #f0f0f0'
            }}>
              {/* Main Image */}
              <div style={{ 
                background: 'white', 
                borderRadius: 12, 
                padding: 20, 
                marginBottom: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <img
                  src={BASE_URL + product.featured_image}
                  alt={product.name}
                  style={{ 
                    width: '100%', 
                    maxWidth: 300,
                    height: 'auto',
                    objectFit: 'contain', 
                    borderRadius: 8,
                    marginBottom: 16
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 8,
                  flexWrap: 'wrap'
                }}>
                  {(product.gallery_images || []).slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={BASE_URL + (img.image_path || img)}
                      alt={`Gallery ${idx + 1}`}
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover', 
                        borderRadius: 8, 
                        border: '2px solid #e8e8e8',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#52c41a'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#e8e8e8'}
                    />
                  ))}
                </div>
                {(product.gallery_images || []).length > 4 && (
                  <div style={{ 
                    marginTop: 8, 
                    fontSize: '12px', 
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    +{(product.gallery_images || []).length - 4} more images
                  </div>
                )}
              </div>

              {/* Quick Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ 
                  background: 'white', 
                  padding: 16, 
                  borderRadius: 8, 
                  textAlign: 'center',
                  border: '1px solid #e8e8e8'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>Stock</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: product.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                    {product.stock}
                  </div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: 16, 
                  borderRadius: 8, 
                  textAlign: 'center',
                  border: '1px solid #e8e8e8'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>Size</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>{product.size}</div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: 16, 
                  borderRadius: 8, 
                  textAlign: 'center',
                  border: '1px solid #e8e8e8'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>Fast Delivery</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: product.fast_delivery_available === 1 ? '#52c41a' : '#ff4d4f' }}>
                    {product.fast_delivery_available === 1 ? 'Yes' : 'No'}
                  </div>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: 16, 
                  borderRadius: 8, 
                  textAlign: 'center',
                  border: '1px solid #e8e8e8'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>Status</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: product.status === 1 ? '#52c41a' : '#ff4d4f'
                  }}>
                    {product.status === 1 ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Product Title and Price */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ 
                  fontSize: screens.md ? '32px' : '24px', 
                  fontWeight: '700', 
                  margin: '0 0 8px 0',
                  color: '#1a1a1a',
                  lineHeight: 1.2
                }}>
                  {product.name}
                </h1>
                {product.subtitle && product.subtitle != "undefined" && (
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#666', 
                    margin: '0 0 16px 0',
                    fontStyle: 'italic'
                  }}>
                    {product.subtitle}
                  </p>
                )}
                <div style={{ marginBottom: 16 }}>
                  {/* Discount Badge */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12,
                      marginBottom: 8
                    }}>
                    {product.discount_percent > 0 && (
                      <span style={{ 
                        background: '#ff4d4f', 
                        color: 'white', 
                        fontSize: '14px', 
                        padding: '4px 8px', 
                        borderRadius: 12,
                        fontWeight: '600'
                      }}>
                        {product.discount_percent}% OFF
                      </span>
                    )}
                      {product.is_featured === 1 && (
                        <span style={{ 
                          background: '#ff6b35', 
                          color: 'white', 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          borderRadius: 12,
                          fontWeight: '500'
                        }}>
                          Featured
                        </span>
                      )}
                      {product?.is_today_deal === 1 && (
                        <span style={{ 
                          background: '#ff4d4f', 
                          color: 'white', 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          borderRadius: 12,
                          fontWeight: '500'
                        }}>
                          Today's Deal
                        </span>
                      )}
                    </div>
                  {/* Price Display */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: 12,
                    flexWrap: 'wrap'
                  }}>
                    {/* Discounted Price */}
                    <div style={{ 
                      fontSize: screens.md ? '36px' : '28px', 
                      fontWeight: '700', 
                      color: '#52c41a',
                      lineHeight: 1
                    }}>
                      {formatPrice(product.discounted_value || product.price)}
                    </div>
                    {/* Original Price (crossed out) */}
                    {product.discount_percent > 0 && (
                      <div style={{ 
                        fontSize: screens.md ? '20px' : '16px', 
                        color: '#999',
                        textDecoration: 'line-through',
                        fontWeight: '500'
                      }}>
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                  {/* Savings Amount */}
                  {product.discount_percent > 0 && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#52c41a', 
                      fontWeight: '500',
                      marginTop: 4
                    }}>
                      You save {formatPrice(product.price - (product.discounted_value || product.price))}
                    </div>
                  )}
                </div>
              </div>

              {/* Brand and Category */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: 16, 
                borderRadius: 12, 
                marginBottom: 24,
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: '600', color: '#333', minWidth: 80 }}>Brand:</span>
                  <span style={{ color: '#666' }}>{product.brand_name}</span>
                  {product.brandlogo && (
                    <img 
                      src={BASE_URL + product.brandlogo} 
                      alt="Brand Logo" 
                      style={{ 
                        width: 32, 
                        height: 32, 
                        objectFit: 'contain', 
                        marginLeft: 12,
                        borderRadius: 4
                      }} 
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#333', minWidth: 80 }}>Category:</span>
                  <span style={{ color: '#666' }}>
                    {product.category_name} / {product.sub_category_name}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    margin: '0 0 12px 0',
                    color: '#1a1a1a',
                    borderBottom: '2px solid #52c41a',
                    paddingBottom: 8
                  }}>
                    Description
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: 1.6, 
                    color: '#444',
                    margin: 0,
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 8,
                    border: '1px solid #e8e8e8'
                  }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {product.feature_title && product.feature_description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    margin: '0 0 12px 0',
                    color: '#1a1a1a',
                    borderBottom: '2px solid #52c41a',
                    paddingBottom: 8
                  }}>
                    Key Features
                  </h3>
                  <div style={{ 
                    background: '#f0f8ff', 
                    padding: 16, 
                    borderRadius: 8,
                    border: '1px solid #d6e4ff'
                  }}>
                    <div style={{ fontWeight: '600', color: '#1890ff', marginBottom: 8 }}>
                      {product.feature_title}
                    </div>
                    <div style={{ color: '#444', lineHeight: 1.5 }}>
                      {product.feature_description}
                    </div>
                  </div>
                </div>
              )}

              {/* Manufacturer Details */}
              {product.manufacturer_details && product.manufacturer_details !="undefined" && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    margin: '0 0 12px 0',
                    color: '#1a1a1a',
                    borderBottom: '2px solid #52c41a',
                    paddingBottom: 8
                  }}>
                    Manufacturer Details
                  </h3>
                  <div style={{ 
                    background: '#fff7e6', 
                    padding: 16, 
                    borderRadius: 8,
                    border: '1px solid #ffd591',
                    color: '#444',
                    lineHeight: 1.5
                  }}>
                    {product.manufacturer_details}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div style={{ display: 'grid', gridTemplateColumns: screens.md ? '1fr 1fr' : '1fr', gap: 16 }}>
                {product.nutritional_facts && (
                  <div>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      margin: '0 0 8px 0',
                      color: '#1a1a1a'
                    }}>
                      Nutritional Facts
                    </h4>
                    <div style={{ 
                      background: '#f6ffed', 
                      padding: 12, 
                      borderRadius: 6,
                      border: '1px solid #b7eb8f',
                      fontSize: '14px',
                      color: '#444'
                    }}>
                      {product.nutritional_facts}
                    </div>
                  </div>
                )}
                
                {product.ingredients && (
                  <div>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      margin: '0 0 8px 0',
                      color: '#1a1a1a'
                    }}>
                      Ingredients
                    </h4>
                    <div style={{ 
                      background: '#fff2e8', 
                      padding: 12, 
                      borderRadius: 6,
                      border: '1px solid #ffbb96',
                      fontSize: '14px',
                      color: '#444'
                    }}>
                      {product.ingredients}
                    </div>
                  </div>
                )}
                
                {product.miscellaneous && (
                  <div>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      margin: '0 0 8px 0',
                      color: '#1a1a1a'
                    }}>
                      Miscellaneous
                    </h4>
                    <div style={{ 
                      background: '#f9f0ff', 
                      padding: 12, 
                      borderRadius: 6,
                      border: '1px solid #d3adf7',
                      fontSize: '14px',
                      color: '#444'
                    }}>
                      {product.miscellaneous}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductPreview; 