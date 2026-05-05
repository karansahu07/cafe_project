import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Image, Typography, Divider, Tag, Space, Modal } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { getProductById } from '../../../services/apiService';
import { calculateDiscountPercentage, normalizeAttributes } from '../../../services/utils/gen_utility';
import '../../../assets/scss/singleProduct.scss';
import MobileProductPreview from '../components/MobileProductPreview';
const { Title, Text, Paragraph } = Typography;

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [parsedAttributes, setParsedAttributes] = useState({ attributes: [], extraAttributes: {} });
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const parentRef = useRef(null);
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      if (response.success) {
        const productData = response.product;
        setProduct(productData);
        setSelectedImage(productData.featured_image);
        
        // Parse attributes using normalizeAttributes function
        if (productData.attributes && productData.attributes.length > 0) {
          const parsed = normalizeAttributes(productData.attributes);
          setParsedAttributes(parsed);
        }
        
        // Set default variant if variants exist
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum price from variants
  const getMinimumPrice = () => {
    if (!product?.variants || product.variants.length === 0) {
      return product?.price || 0;
    }
    return Math.min(...product.variants.map(variant => parseFloat(variant.price)));
  };

  // Get current price based on selected variant or product price
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return parseFloat(selectedVariant.price);
    }
    return product?.price || 0;
  };

  // Format price in dollars
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Handle image selection
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Loading product...</Text>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Product not found</Text>
      </div>
    );
  }

  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const hasSingleVariant = product.variants && product.variants.length === 1;

  return (
    <div id='previewHost' ref={parentRef} className="single-product p2"
     style={{
       backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        position:"relative",
        overflow: "hidden",
        //  border: "2px solid #1890ff",
         height: "100%",  width: "100%",
         }}>
      <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Image Gallery Section */}
          <Col xs={24} md={12}>
            <div className="single-product__image-section" style={{ textAlign: 'center' }}>
              {/* Main Image */}
              <div style={{ marginBottom: '16px' }}>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  className="main-image"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                
                  preview={{
                    maskClassName: "pcoded-content ", // custom mask css
                    className: "custom-preview-img", // img par css
                    getContainer: () => parentRef.current ||false, // yaha parent ko pass kar rahe hain
                    

                  }}
                />
              </div>
              {/* Thumbnail Images */}
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div className="thumbnail-gallery">
                  {/* Featured Image Thumbnail */}
                  <div
                    onClick={() => handleImageClick(product.featured_image)}
                    className={`thumbnail-item ${selectedImage === product.featured_image ? 'active' : ''}`}
                  >
                    <Image
                      src={product.featured_image}
                      alt="Featured"
                      className="thumbnail-image"
                      // width={45}
                      // height={45}
                      preview={false}
                    />
                  </div>
                  
                  {/* Gallery Images Thumbnails */}
                  {product.gallery_images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageClick(img.image_path)}
                      className={`thumbnail-item ${selectedImage === img.image_path ? 'active' : ''}`}
                    >
                      <Image
                        src={img.image_path}
                        alt={`Gallery ${index + 1}`}
                        className="thumbnail-image"
                        // width={45}
                        // height={45}
                        preview={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Product Details Section */}
          <Col xs={24} md={12}>
            <div className="single-product__details">
              {/* Product Name */}
              <Title level={2} className="product-title">
                {product.name}
              </Title>

              {/* Category and Brand */}
              <Space className="product-tags">
                {product.category_name && (
                  <Tag color="blue">{product.category_name}</Tag>
                )}
                {product.sub_category_name && (
                  <Tag color="cyan">{product.sub_category_name}</Tag>
                )}
                {product.brand_name && (
                  <Tag color="green">{product.brand_name}</Tag>
                )}
                {product.food_type === 1 && (
                  <Tag color="orange">Vegetarian</Tag>
                )}
              </Space>

              {/* Price Section */}
              <div className="price-section">
                {hasMultipleVariants ? (
                  <div>
                    <Text className="current-price">
                      Starting from {formatPrice(getMinimumPrice())}
                    </Text>
                    <br />
                    <Text type="secondary" className="price-note">Price varies by variant</Text>
                  </div>
                ) : (
                  <div>
                    <Text className="current-price">
                      {formatPrice(calculateDiscountPercentage(product.price,product.discount_percent))}
                    </Text>
                    {product.discount_percent > 0 && (
                      <div>
                        <Text delete className="original-price">
                          {formatPrice(product.price)}
                        </Text>
                        <Tag color="red" className="discount-tag">
                          {product.discount_percent}% OFF
                        </Tag>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stock/Availability Status */}
              <div className="status-section">
                {hasMultipleVariants ? (
                  <div>
                    <Text strong>Availability: </Text>
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Available in multiple variants
                    </Tag>
                  </div>
                ) : hasSingleVariant ? (
                  <div>
                    <Text strong>Status: </Text>
                    {product.status === 1 ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Available
                      </Tag>
                    ) : (
                      <Tag color="red" icon={<CloseCircleOutlined />}>
                        Unavailable
                      </Tag>
                    )}
                  </div>
                ) : (
                  <div>
                    <Text strong>Stock: </Text>
                    <Tag color={product.stock > 0 ? "green" : "red"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Tag>
                  </div>
                )}
              </div>

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="variants-section">
                  <Text strong className="variants-label">Variants:</Text>
                  <Space wrap>
                    {product.variants.map((variant, index) => (
                      <Tag
                        key={variant.id || index}
                        color={selectedVariant?.id === variant.id ? "blue" : "default"}
                        className={`variant-tag ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                        onClick={() => handleVariantSelect(variant)}
                      >
                        {variant.type}: {variant.value} - {formatPrice(variant.price)}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {/* Attributes Section */}
              {parsedAttributes.attributes && parsedAttributes.attributes.length > 0 && (
                <div className="attributes-section">
                  <Text strong className="attributes-label">Attributes:</Text>
                  <Row gutter={[16, 8]}>
                    {parsedAttributes.attributes.map((attr, index) => (
                      <Col span={12} key={index}>
                        <div className="attribute-item">
                          <Text type="secondary" className="attribute-name" style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                            {attr.key.replace('_', ' ')}:
                          </Text>
                          <br />
                          <Text strong className="attribute-value" style={{ fontSize: '14px' }}>
                            {attr.value}
                          </Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Special Attributes Section (Unit, Quantity, Availability) */}
              {parsedAttributes.extraAttributes && Object.keys(parsedAttributes.extraAttributes).length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Product Specifications:</Text>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#e6f7ff', 
                    borderRadius: '8px',
                    border: '1px solid #91d5ff'
                  }}>
                    <Row gutter={[16, 8]}>
                      {(parsedAttributes.extraAttributes.quantity || parsedAttributes.extraAttributes.unit) && (
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Quantity</Text>
                            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                              {parsedAttributes.extraAttributes.quantity || ''} {parsedAttributes.extraAttributes.unit || ''}
                            </Tag>
                          </div>
                        </Col>
                      )}
                      {parsedAttributes.extraAttributes.is_available !== undefined && (
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Availability</Text>
                            <Tag 
                              color={parsedAttributes.extraAttributes.is_available === '1' || parsedAttributes.extraAttributes.is_available === 'true' ? "green" : "red"} 
                              icon={parsedAttributes.extraAttributes.is_available === '1' || parsedAttributes.extraAttributes.is_available === 'true' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                              style={{ fontSize: '14px', padding: '4px 8px' }}
                            >
                              {parsedAttributes.extraAttributes.is_available === '1' || parsedAttributes.extraAttributes.is_available === 'true' ? 'Available' : 'Unavailable'}
                            </Tag>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {product.addons && product.addons.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Add-ons:</Text>
                  <Space wrap>
                    {product.addons.map((addon, index) => (
                      <Tag key={index} color="purple">
                        {addon.name} - {formatPrice(addon.price)}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {/* Features */}
              <div style={{ marginBottom: '16px' }}>
                <Space wrap>
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

              <Divider />

              {/* Description */}
              <div className="description-section">
                <Text strong className="description-label">Description:</Text>
                <Paragraph className="description-content" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {product.description}
                </Paragraph>
              </div>

              {/* Product Details */}
              <div className="single-product__additional-info">
                <Text strong className="info-title">Product Details:</Text>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text type="secondary">Product ID:</Text>
                    <br />
                    <Text>{product.id}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Vendor ID:</Text>
                    <br />
                    <Text>{product.vendor_id}</Text>
                  </Col>
                  {product.size && product.size !== "0" && (
                    <Col span={12}>
                      <Text type="secondary">Size:</Text>
                      <br />
                      <Text>{product.size}</Text>
                    </Col>
                  )}
                  <Col span={12}>
                    <Text type="secondary">Created:</Text>
                    <br />
                    <Text>{new Date(product.created_at).toLocaleDateString()}</Text>
                  </Col>
                </Row>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 24 }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />}
                    size="large"
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    type="default" 
                    icon={<HeartOutlined />}
                    size="large"
                  >
                    Add to Wishlist
                  </Button>
                  <Button 
                    type="default" 
                    onClick={() => setShowMobilePreview(true)}
                    size="large"
                  >
                    Mobile Preview
                  </Button>
                </Space>
              </div>
            
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Mobile Product Preview Modal */}
      <MobileProductPreview
        open={showMobilePreview}
        onClose={() => setShowMobilePreview(false)}
        product={product}
        BASE_URL=""
      />
    </div>
  );
};

export default SingleProduct;
