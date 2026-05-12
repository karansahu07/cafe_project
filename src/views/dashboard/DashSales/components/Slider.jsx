import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button } from 'antd';
import * as LucideIcons from 'lucide-react';

// Map material-style/string keys to Lucide icon component names
const ICON_MAP = {
  trending_up: 'TrendingUp',
  'trending-up': 'TrendingUp',
  people: 'Users',
  users: 'Users',
  shopping_cart: 'ShoppingCart',
  'shopping-bag': 'ShoppingBag',
  payments: 'DollarSign',
  dollar: 'DollarSign',
  'dollar-sign': 'DollarSign',
  star: 'Star',
  support_agent: 'Headphones',
  headset_mic: 'Headphones',
  repeat: 'RefreshCw',
  refresh: 'RefreshCw',
  'refresh-cw': 'RefreshCw',
  thumb_up: 'ThumbsUp',
  'thumbs-up': 'ThumbsUp',
  inventory_2: 'Boxes',
  inventory: 'Boxes',
  category: 'Shapes',
  local_offer: 'Tag',
  tag: 'Tag',
  eye: 'Eye',
  download: 'Download',
  'download-cloud': 'DownloadCloud',
  'check-circle': 'CheckCircle',
};

const Slider = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards per view (1 on mobile, 2 on tablet, 3 on desktop)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 576) setCardsPerView(1);
      else if (w < 992) setCardsPerView(2);
      else setCardsPerView(3);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Auto-advance only on mobile (slider mode)
  useEffect(() => {
    if (cardsPerView !== 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % Math.max(1, Math.ceil(items.length / cardsPerView)));
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length, cardsPerView]);

  // Group items into slides of N cards
  const slides = useMemo(() => {
    const out = [];
    for (let i = 0; i < items.length; i += cardsPerView) {
      out.push(items.slice(i, i + cardsPerView));
    }
    return out;
  }, [items, cardsPerView]);

  const handleDotClick = (index) => setActiveIndex(index);
  const prev = () => setActiveIndex((idx) => (idx - 1 + slides.length) % slides.length);
  const next = () => setActiveIndex((idx) => (idx + 1) % slides.length);

  // Desktop/tablet: static 3-card grid (no slider)
  if (cardsPerView !== 1) {
    return (
      <Row gutter={[16, 16]}>
        {items.map((item, idx) => (
          <Col key={idx} xs={24} sm={12} md={12} lg={8}>
            <Card
              bordered
              hoverable
              style={{ height: '100%', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              bodyStyle={{ padding: 16 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{item.title}</h5>
                  {item.description && (
                    <p style={{ margin: '6px 0 10px 0', color: '#8c8c8c', fontSize: 13 }}>{item.description}</p>
                  )}
                </div>
              </div>
              {item.stats && (
                <Row gutter={[12, 12]}>
                  {item.stats.map((stat, sIdx) => {
                    const mappedName = ICON_MAP[stat.icon] || stat.icon;
                    const IconComponent = LucideIcons[mappedName] || LucideIcons[mappedName && mappedName.charAt(0).toUpperCase() + mappedName.slice(1)];
                    return (
                      <Col key={sIdx} xs={12}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            backgroundColor: '#e6f7ef',
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8
                          }}>
                            {IconComponent ? (
                              <IconComponent size={16} color="#961818" />
                            ) : (
                              <span style={{ color: '#961818', fontSize: 16 }}>{stat.icon}</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{stat.value}</div>
                            <div style={{ color: '#8c8c8c', fontSize: 12 }}>{stat.label}</div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  // Mobile: slider with 1 card per view
  return (
    <Card className="slider-card" style={{ marginBottom: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
      <div style={{ padding: 0 }}>
        <div className="slider-container" style={{ position: 'relative' }}>
          {/* Track */}
          <div
            className="slider-track"
            style={{
              display: 'flex',
              transition: 'transform 0.45s ease',
              transform: `translateX(-${activeIndex * 100}%)`,
              willChange: 'transform'
            }}
          >
            {items.map((item, idx) => (
              <div key={idx} className="slider-item" style={{ width: '100%', flexShrink: 0 }}>
                <div style={{ padding: '12px 16px' }}>
                  <Card bordered hoverable bodyStyle={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <h5 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{item.title}</h5>
                        {item.description && (
                          <p style={{ margin: '6px 0 10px 0', color: '#8c8c8c', fontSize: 13 }}>{item.description}</p>
                        )}
                      </div>
                    </div>
                    {item.stats && (
                      <Row gutter={[12, 12]}>
                        {item.stats.map((stat, sIdx) => {
                          const mappedName = ICON_MAP[stat.icon] || stat.icon;
                          const IconComponent = LucideIcons[mappedName] || LucideIcons[mappedName && mappedName.charAt(0).toUpperCase() + mappedName.slice(1)];
                          return (
                            <Col key={sIdx} xs={12}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                  backgroundColor: '#e6f7ef',
                                  width: 32,
                                  height: 32,
                                  borderRadius: 6,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 8
                                }}>
                                  {IconComponent ? (
                                    <IconComponent size={16} color="#961818" />
                                  ) : (
                                    <span style={{ color: '#961818', fontSize: 16 }}>{stat.icon}</span>
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{stat.value}</div>
                                  <div style={{ color: '#8c8c8c', fontSize: 12 }}>{stat.label}</div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="slider-dots" style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 12, bottom: 0 }}>
            {items.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${activeIndex === index ? 'active' : ''}`}
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: activeIndex === index ? '#961818' : '#ddd',
                  borderRadius: '50%',
                  border: 'none',
                  margin: '0 4px',
                  cursor: 'pointer'
                }}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Slider;