import React from 'react';
import { Card as AntCard } from 'antd';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, BarChart2 } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  const getIconClass = () => {
    if (!trend) return '';
    return trend === 'up' ? 'text-success' : 'text-danger';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getIcon = () => {
    switch(icon) {
      case 'payments':
      case 'attach_money':
        return <DollarSign size={24} />;
      case 'group':
      case 'person':
        return <Users size={24} />;
      case 'shopping_cart':
        return <ShoppingCart size={24} />;
      case 'trending_up':
      default:
        return <BarChart2 size={24} />;
    }
  };

  return (
    <AntCard className="stat-card shadow-sm mb-4" bordered={false}>
      <div  className="d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-1" style={{ fontSize: '14px' }}>{title}</p>
          <h3 className="mb-0" style={{ fontSize: '24px', fontWeight: '600' }}>{value}</h3>
          {trend && (
            <div className={`trend-indicator ${getIconClass()} d-flex align-items-center mt-2`} style={{ gap: '4px' }}>
              {getTrendIcon()}
              <span style={{ fontWeight: '500' }}>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="icon-box" style={{ backgroundColor: '#e6f7ef', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#088B46' }}>
            {getIcon()}
          </span>
        </div>
      </div>
    </AntCard>
  );
};

export default StatCard;