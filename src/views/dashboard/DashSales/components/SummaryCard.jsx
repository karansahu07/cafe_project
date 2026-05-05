import React from 'react';
import { Card, Row, Col } from 'antd';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, ShoppingBag } from 'lucide-react';

const SummaryCard = ({ title, metrics }) => {
  return (
    <Card className="summary-card shadow-sm mb-4" bordered={false}>
      {title && (
        <div style={{ padding: '16px 24px 0 24px' }}>
          <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{title}</h5>
        </div>
      )}
      <div style={{ padding: '16px 24px' }}>
        <Row gutter={[16, 16]}>
          {metrics.map((metric, index) => {
            const getIcon = () => {
              switch(metric.icon) {
                case 'trending_up': return <TrendingUp size={16} />;
                case 'trending_down': return <TrendingDown size={16} />;
                case 'attach_money': return <DollarSign size={16} />;
                case 'people': return <Users size={16} />;
                case 'shopping_bag': return <ShoppingBag size={16} />;
                default: return <Activity size={16} />;
              }
            };
            
            return (
              <Col key={index} xs={12} sm={12} md={metrics.length > 3 ? 6 : 24 / metrics.length} lg={metrics.length > 3 ? 6 : 24 / metrics.length}>
                <div style={{ 
                  padding: '8px', 
                  borderRight: index < metrics.length - 1 ? '1px solid #f0f0f0' : 'none',
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    {metric.icon && (
                      <div style={{ 
                        backgroundColor: '#e6f7ef', 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '8px'
                      }}>
                        <span style={{ color: '#088B46' }}>
                          {getIcon()}
                        </span>
                      </div>
                    )}
                    <h6 style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>{metric.label}</h6>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{metric.value}</h3>
                  {metric.trend && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginTop: '8px',
                      color: metric.trend.direction === 'up' ? '#52c41a' : '#f5222d'
                    }}>
                      {metric.trend.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span style={{ marginLeft: '4px', fontWeight: '500' }}>{metric.trend.value}</span>
                    </div>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </Card>
  );
};

export default SummaryCard;