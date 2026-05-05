
import React, { useState, useEffect } from 'react';
import { Drawer, Button, Card, Divider, Tag, Space, Image, Spin, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  MoreOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getProductById } from '../../../services/apiService';
import { formatPrice, calculateDiscountPercentage } from '../../../services/utils/gen_utility';

// Mobile Preview Component (iOS Emulator Style)
const MobilePreview = ({ product, selectedImage, selectedVariant, quantity, selectedAddons, onImageClick, onVariantSelect, onAddonToggle, onClearAddons, onQuantityChange, getCurrentPrice }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSwipeInterval, setAutoSwipeInterval] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get all images including featured image
  const getAllImages = () => {
    const images = [product.featured_image];
    if (product.gallery_images) {
      images.push(...product.gallery_images.map(img => img.image_path));
    }
    return images;
  };

  const allImages = getAllImages();

  // Clear auto swipe when user interacts
  const clearAutoSwipe = () => {
    if (autoSwipeInterval) {
      clearInterval(autoSwipeInterval);
      setAutoSwipeInterval(null);
    }
  };

  // Handle swipe logic (common for touch and mouse)
  const handleSwipe = (startX, endX) => {
    if (!startX || !endX) return;
    
    const distance = startX - endX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && allImages.length > 1) {
      // Swipe left - next image
      const nextIndex = (currentImageIndex + 1) % allImages.length;
      setCurrentImageIndex(nextIndex);
      onImageClick(allImages[nextIndex]);
    } else if (isRightSwipe && allImages.length > 1) {
      // Swipe right - previous image
      const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      onImageClick(allImages[prevIndex]);
    }
  };

  // Touch gesture handlers
  const onTouchStart = (e) => {
    e.stopPropagation();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    clearAutoSwipe();
  };

  const onTouchMove = (e) => {
    e.stopPropagation();
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Only prevent default if we're actually swiping horizontally
    const distance = Math.abs(touchStart - currentTouch);
    if (distance > 10) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e) => {
    e.stopPropagation();
    handleSwipe(touchStart, touchEnd);
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse gesture handlers
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
    clearAutoSwipe();
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging || !mouseStart) return;
    
    setMouseEnd(e.clientX);
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) return;
    
    handleSwipe(mouseStart, mouseEnd);
    
    // Reset mouse states
    setMouseStart(null);
    setMouseEnd(null);
    setIsDragging(false);
  };

  const onMouseLeave = (e) => {
    if (isDragging) {
      onMouseUp(e);
    }
  };

  // Auto swipe functionality
  useEffect(() => {
    if (product && allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % allImages.length;
          onImageClick(allImages[nextIndex]);
          return nextIndex;
        });
      }, 3000); // Change image every 3 seconds

      setAutoSwipeInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [product, allImages, onImageClick]);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (autoSwipeInterval) {
        clearInterval(autoSwipeInterval);
      }
    };
  }, [autoSwipeInterval]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#000',
      padding: '20px',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* iOS Phone Frame */}
      <div style={{
        // width: 375,
        height: "80vh",
        aspectRatio:"9/19.5",
        background: '#fff',
        borderRadius: 40,
        padding: '8px',
        backgroundColor: 'black',
        boxShadow: '0 0 30px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Status Bar */}
        <div style={{
          height: 44,
          background: '#000',
          borderRadius: '32px 32px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          color: '#fff',
          fontSize: 14,
          fontWeight: '600'
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 16, height: 8, background: '#fff', borderRadius: 4 }}></div>
            <div style={{ width: 20, height: 8, background: '#fff', borderRadius: 4 }}></div>
            <div style={{ width: 24, height: 8, background: '#fff', borderRadius: 4 }}></div>
          </div>
        </div>

        {/* App Content */}
        <div style={{
          flex: 1,
          background: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>
          {/* Scrollable Content */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}>
            {/* Product Image with 3:2 aspect ratio and swipe gestures */}
            <div 
              style={{ 
                position: 'relative', 
                width: '100%',
                background: '#f5f5f5',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'manipulation',
                display: 'block',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none'
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={selectedImage}
                alt={product.name}
                preview={{
                  mask: false,
                  src: selectedImage
                }}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: 'block',
                  maxWidth: 'none',
                  pointerEvents: 'none'
                }}
                wrapperStyle={{
                  width: '100%',
                  display: 'block',
                  pointerEvents: 'none'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYzN"
              />
              
              {/* Black gradient overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
                pointerEvents: 'none'
              }}></div>
              
              {/* Image Gallery Dots */}
              {allImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 8,
                //   top:0
                }}>
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: idx === currentImageIndex ? '#088B46' : 'rgba(255,255,255,0.5)',
                        border: idx === currentImageIndex ? '2px solid #088B46' : '2px solid #d9d9d9',
                        transition: 'background 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        onImageClick(allImages[idx]);
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Swipe Instructions */}
              {allImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  opacity: 0.8,
                  pointerEvents: 'none'
                }}>
                  Swipe or drag to change image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ 
              padding: '20px 16px'
            }}>
              {/* Product Name */}
              <h1 style={{
                fontSize: 20,
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

              {/* Price and Delivery Section */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 20 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 24,
                      fontWeight: '700',
                      color: '#088B46'
                    }}>
                      {formatPrice(calculateDiscountPercentage(product.price, product.discount_percent))}
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
                  {product.discount_percent > 0 && (
                    <span style={{
                      fontSize: 12,
                      color: '#088B46',
                      fontWeight: '600',
                      background: '#f6ffed',
                      padding: '2px 6px',
                      borderRadius: 4,
                      alignSelf: 'flex-start'
                    }}>
                      {product.discount_percent}% OFF
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ClockCircleOutlined style={{ color: '#088B46' }} />
                  <span style={{ fontSize: 12, color: '#666' }}>Available on fast delivery</span>
                </div>
              </div>

              {/* Product Details Section */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  color: '#1a1a1a'
                }}>
                  Product Details
                </h3>
                <div style={{
                  background: '#fff',
                  padding: 0
                }}>
                  {/* Nutritional Information */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#666' }}>Energy</span>
                      <span style={{ fontSize: 14, fontWeight: '500' }}>273 kcal</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#666' }}>Protein</span>
                      <span style={{ fontSize: 14, fontWeight: '500' }}>5.0 g</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#666' }}>Carbohydrate</span>
                      <span style={{ fontSize: 14, fontWeight: '500' }}>37.0 g</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, color: '#666' }}>Total Sugars</span>
                      <span style={{ fontSize: 14, fontWeight: '500' }}>2.3 g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                    color: '#1a1a1a'
                  }}>
                    Variants
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {product.variants.map((variant, index) => (
                      <div
                        key={variant.id || index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          border: selectedVariant?.id === variant.id ? '2px solid #088B46' : '1px solid #d9d9d9',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: selectedVariant?.id === variant.id ? '#f6ffed' : '#fff'
                        }}
                        onClick={() => onVariantSelect(variant)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: '2px solid #d9d9d9',
                            background: selectedVariant?.id === variant.id ? '#088B46' : '#fff',
                            position: 'relative'
                          }}>
                            {selectedVariant?.id === variant.id && (
                              <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#fff',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}></div>
                            )}
                          </div>
                          <span style={{ fontSize: 14 }}>{variant.type}: {variant.value}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: '600' }}>
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {product.addons && product.addons.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 12 
                  }}>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: '600',
                      margin: 0,
                      color: '#1a1a1a'
                    }}>
                      Add on
                    </h3>
                    {selectedAddons.length > 0 && (
                      <Button 
                        type="text" 
                        size="small"
                        onClick={onClearAddons}
                        style={{ color: '#088B46' }}
                      >
                        clear
                      </Button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {product.addons.map((addon, index) => {
                      const isSelected = selectedAddons.find(a => a.id === addon.id);
                      return (
                        <div
                          key={addon.id || index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            border: isSelected ? '2px solid #088B46' : '1px solid #d9d9d9',
                            borderRadius: 8,
                            cursor: 'pointer',
                            background: isSelected ? '#f6ffed' : '#fff'
                          }}
                          onClick={() => onAddonToggle(addon)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              border: '2px solid #d9d9d9',
                              background: isSelected ? '#088B46' : '#fff',
                              position: 'relative'
                            }}>
                              {isSelected && (
                                <div style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: '#fff',
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)'
                                }}></div>
                              )}
                            </div>
                            <span style={{ fontSize: 14 }}>{addon.name}</span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: '600' }}>
                            {formatPrice(addon.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom padding for floating button */}
              {(selectedVariant || selectedAddons.length > 0) && (
                <div style={{ height: 80 }}></div>
              )}
            </div>
          </div>

          {/* Floating Items Added Button */}
          {/* {(selectedVariant || selectedAddons.length > 0) && (
            <div style={{
              position: 'absolute',
              bottom: 80,
              left: 16,
              right: 16,
              zIndex: 20
            }}>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  height: 44,
                  background: '#088B46',
                  borderColor: '#088B46',
                  borderRadius: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>{selectedVariant ? 1 : 0 + selectedAddons.length} items added</span>
                <ArrowLeftOutlined style={{ transform: 'rotate(180deg)' }} />
              </Button>
            </div>
          )} */}

          {/* Bottom Action Bar */}
          <div style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#088B46',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{ 
              color: '#fff', 
              fontSize: 18, 
              fontWeight: '600',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <span>{formatPrice(getCurrentPrice() * quantity)}</span>
              {product.discount_percent > 0 && (
                <span style={{
                  fontSize: 12,
                  opacity: 0.8,
                  textDecoration: 'line-through'
                }}>
                  {formatPrice(product.price)}
                </span> 
              )}
            </div>
            
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden'
            }}>
              <Button
                type="text"
                style={{ 
                  border: 'none', 
                  borderRadius: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                // onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span style={{
                padding: '0 16px',
                minWidth: 40,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600'
              }}>
                {quantity}
              </span>
              <Button
                type="text"
                style={{ 
                  border: 'none', 
                  borderRadius: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                // onClick={() => onQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          height: 34,
          background: '#000',
          borderRadius: '0 0 32px 32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: 134,
            height: 5,
            background: '#fff',
            borderRadius: 3
          }}></div>
        </div>
      </div>
    </div>
  );
};

// Full Details Component
const FullDetails = ({ product, onClose, onToggleMode }) => {
  const [selectedDetailImage, setSelectedDetailImage] = useState(product?.featured_image || '');

  // Get all images for full detail view
  const getAllDetailImages = () => {
    const images = [product.featured_image];
    if (product.gallery_images) {
      images.push(...product.gallery_images.map(img => img.image_path));
    }
    return images.filter(img => img); // Remove any null/undefined images
  };

  const allDetailImages = getAllDetailImages();

  // Update selected image when product changes
  React.useEffect(() => {
    if (product?.featured_image) {
      setSelectedDetailImage(product.featured_image);
    }
  }, [product]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <div style={{
        background: '#088B46',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onClose}
            style={{ color: '#fff', fontSize: 18 }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: '600' }}>Product Details</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{product.name}</div>
          </div>
        </div>
        <Button
          type="text"
          onClick={onToggleMode}
          style={{ 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            fontSize: 12,
            height: 32,
            padding: '0 12px'
          }}
        >
          Mobile Preview
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '20px 16px'
      }}>
        {/* Product Image and Basic Info */}
        <div style={{ marginBottom: 24 }}>
          {/* Main Product Image */}
          <div style={{ 
            position: 'relative', 
            height: 250, 
            display: 'flex',
            borderRadius: 12, 
            width: '100%',
            overflow: 'hidden',
            marginBottom: 16
          }}>
            <Image
              src={selectedDetailImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                maxWidth: 'none'
              }}
              wrapperStyle={{
                width: '100%',
                display: 'block'
              }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYzN"
            />
          </div>

          {/* Image Gallery Thumbnails */}
          {allDetailImages.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                Gallery
              </h4>
              <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'thin'
              }}>
                {allDetailImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: 60,
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedDetailImage === image ? '2px solid #088B46' : '2px solid #d9d9d9',
                      transition: 'border-color 0.2s ease',
                      flexShrink: 0,
                      position: 'relative',
                      backgroundColor: '#f5f5f5'
                    }}
                    onClick={() => setSelectedDetailImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        border: 'none',
                        outline: 'none'
                      }}
                      onError={(e) => {
                        e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTGFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklQVR4Ae3dP3Ik1RnG4W+FgYzN";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Product Name */}
          <h1 style={{
            fontSize: 24,
            fontWeight: '700',
            // margin: '0 0 8px 0',
            color: '#1a1a1a',
            lineHeight: 1.2
          }}>
            {product.name}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 16,
            color: '#666',
            margin: '0 0 16px 0',
            lineHeight: 1.5
          }}>
            {product.description}
          </p>

          {/* Price */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#088B46'
              }}>
                {formatPrice(calculateDiscountPercentage(product.price, product.discount_percent || 0))}
              </span>
              {product.discount_percent > 0 && (
                <span style={{
                  fontSize: 18,
                  color: '#999',
                  textDecoration: 'line-through'
                }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.discount_percent > 0 && (
              <span style={{
                fontSize: 14,
                color: '#088B46',
                fontWeight: '600',
                background: '#f6ffed',
                padding: '4px 8px',
                borderRadius: 6,
                display: 'inline-block'
              }}>
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Variants Section */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: '#1a1a1a'
              }}>
                Available Variants
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {product.variants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid #e8e8e8',
                      borderRadius: 12,
                      background: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: '500', color: '#1a1a1a' }}>
                        {variant.type}: {variant.value}
                      </span>
                      {variant.description && (
                        <span style={{ fontSize: 14, color: '#666' }}>
                          {variant.description}
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: 16, 
                      fontWeight: '600',
                      color: '#088B46'
                    }}>
                      {formatPrice(variant.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {product.addons && product.addons.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: '#1a1a1a'
              }}>
                Available Add-ons
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {product.addons.map((addon, index) => (
                  <div
                    key={addon.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: '1px solid #e8e8e8',
                      borderRadius: 12,
                      background: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: '500', color: '#1a1a1a' }}>
                        {addon.name}
                      </span>
                      {addon.description && (
                        <span style={{ fontSize: 14, color: '#666' }}>
                          {addon.description}
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: 16, 
                      fontWeight: '600',
                      color: '#088B46'
                    }}>
                      {formatPrice(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full Product Details Section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: 16,
            border: '1px solid #e8e8e8'
          }}>
            {/* Basic Information */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                Basic Information
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Product ID</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>#{product.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Vendor ID</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>#{product.vendor_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Category</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>{product.category_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Sub Category</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>{product.sub_category_name}</span>
                </div>
                {product.brand_name && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#666' }}>Brand</span>
                    <span style={{ fontSize: 13, fontWeight: '500' }}>{product.brand_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Information */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                Pricing Information
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Original Price</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>{formatPrice(product.price)}</span>
                </div>
                {product.discount_percent > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#666' }}>Discounted Price</span>
                      <span style={{ fontSize: 13, fontWeight: '500', color: '#088B46' }}>
                        {formatPrice(calculateDiscountPercentage(product.price, product.discount_percent))}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#666' }}>Discount</span>
                      <span style={{ fontSize: 13, fontWeight: '500', color: '#088B46' }}>{product.discount_percent}%</span>
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Unit</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>{product.product_unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Quantity</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>{product.product_quantity}</span>
                </div>
              </div>
            </div>

            {/* Stock & Status */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                Stock & Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Stock</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: '500',
                    color: product.stock > 0 ? '#088B46' : '#ff4d4f'
                  }}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Status</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: '500',
                    color: product.status === 1 ? '#088B46' : '#ff4d4f'
                  }}>
                    {product.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Fast Delivery</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: '500',
                    color: product.fast_delivery_available === 1 ? '#088B46' : '#666'
                  }}>
                    {product.fast_delivery_available === 1 ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Featured Product</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: '500',
                    color: product.is_featured === 1 ? '#088B46' : '#666'
                  }}>
                    {product.is_featured === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Today's Deal</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: '500',
                    color: product.is_today_deal === 1 ? '#088B46' : '#666'
                  }}>
                    {product.is_today_deal === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Food Type</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>
                    {product.food_type === 1 ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(product.ingredients || product.manufacturer_details || product.nutritional_facts) && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                  Additional Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {product.ingredients && (
                    <div>
                      <span style={{ fontSize: 13, color: '#666' }}>Ingredients: </span>
                      <span style={{ fontSize: 13, fontWeight: '500' }}>{product.ingredients}</span>
                    </div>
                  )}
                  {product.manufacturer_details && product.manufacturer_details !== 'undefined' && (
                    <div>
                      <span style={{ fontSize: 13, color: '#666' }}>Manufacturer: </span>
                      <span style={{ fontSize: 13, fontWeight: '500' }}>{product.manufacturer_details}</span>
                    </div>
                  )}
                  {product.nutritional_facts && (
                    <div>
                      <span style={{ fontSize: 13, color: '#666' }}>Nutritional Facts: </span>
                      <span style={{ fontSize: 13, fontWeight: '500' }}>{product.nutritional_facts}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: '600', color: '#088B46', margin: '0 0 8px 0' }}>
                Timestamps
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Created</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Last Updated</span>
                  <span style={{ fontSize: 13, fontWeight: '500' }}>
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MobileProductSheet = ({ 
  open, 
  onClose, 
  productId, 
  BASE_URL 
}) => {
  console.log('MobileProductSheet props:', { open, productId, BASE_URL });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Fetch product data when sheet opens
  useEffect(() => {
    console.log('MobileProductSheet useEffect triggered:', { open, productId });
    if (open && productId) {
      fetchProduct();
    }
  }, [open, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      if (response.success) {
        const productData = response.product;
        console.log("productData",productData)
        setProduct(productData);
        setSelectedImage(productData.featured_image);
        
        // Set default variant if variants exist
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } else {
        message.error('Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      message.error('Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate current price
  const getCurrentPrice = () => {
    let basePrice = product?.price || 0;
    
    if (selectedVariant) {
      basePrice = parseFloat(selectedVariant.price);
    }
    
    // Add addon prices
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + parseFloat(addon.price), 0);
    
    return calculateDiscountPercentage(basePrice, product?.discount_percent || 0) + addonTotal;
  };

  // Get original price (without discount)
  const getOriginalPrice = () => {
    let basePrice = product?.price || 0;
    
    if (selectedVariant) {
      basePrice = parseFloat(selectedVariant.price);
    }
    
    // Add addon prices
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + parseFloat(addon.price), 0);
    
    return basePrice + addonTotal;
  };

  // Handle image selection
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  // Handle addon selection
  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.find(a => a.id === addon.id);
      if (isSelected) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Clear all addons
  const clearAddons = () => {
    setSelectedAddons([]);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  // Handle mode toggle
  const handleToggleMode = () => {
    setShowFullDetails(!showFullDetails);
  };

  if (!product && !loading) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={null}
      placement="right"
      width={ 500}
      closable={false}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ display: 'none' }}
      zIndex={2000}
    >
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Spin size="large" />
        </div>
      ) : product ? (
        showFullDetails ? (
          <FullDetails 
            product={product} 
            onClose={onClose}
            onToggleMode={handleToggleMode}
          />
        ) : (
          <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            background: '#fff',
            position: 'relative'
          }}>
            {/* Sheet Header with Toggle */}
            <div style={{
              background: '#088B46',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={onClose}
                  style={{ color: '#fff', fontSize: 18 }}
                />
                <div>
                  <div style={{ fontSize: 16, fontWeight: '600' }}>Mobile Preview</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{product.name}</div>
                </div>
              </div>
              <Button
                type="text"
                onClick={handleToggleMode}
                style={{ 
                  color: '#fff', 
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 6,
                  fontSize: 12,
                  height: 32,
                  padding: '0 12px'
                }}
              >
                View Full Details
              </Button>
            </div>

            {/* Mobile Preview Component */}
            <MobilePreview 
              product={product}
              selectedImage={selectedImage}
              selectedVariant={selectedVariant}
              quantity={quantity}
              selectedAddons={selectedAddons}
              onImageClick={handleImageClick}
              onVariantSelect={handleVariantSelect}
              onAddonToggle={handleAddonToggle}
              onClearAddons={clearAddons}
              onQuantityChange={handleQuantityChange}
              getCurrentPrice={getCurrentPrice}
            />
          </div>
        )
      ) : null}
    </Drawer>
  );
};

export default React.memo(MobileProductSheet);
