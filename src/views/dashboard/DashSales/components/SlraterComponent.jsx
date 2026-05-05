import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import Chart from 'react-apexcharts';
import { Download, RefreshCw, TrendingUp, DollarSign, UserPlus, Heart, Users, ThumbsUp, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * SLRATER Component - Sales, Leads, Retention, Acquisition, Traffic, Engagement, Revenue
 * A comprehensive dashboard component that displays key business metrics
 */
const SlraterComponent = () => {
  // Admin Home Stats Cards
  const stats = [
    { id: 'totalOrders', label: 'Total Orders', subtitle: 'Today / This Month', primary: '268 / 5,432', growth: '+6.2%', trend: 'up', icon: 'trending-up', color: '#088B46' },
    { id: 'revenue', label: 'Total Revenue', subtitle: 'Today / This Month', primary: '$12,430 / $187,540', growth: '+12.4%', trend: 'up', icon: 'briefcase', color: '#36BFFA', extra: 'Admin Commission: $18,754' },
    { id: 'activeVendors', label: 'Active Vendors', subtitle: 'Live / New this month', primary: '142 / 18', growth: '+3.1%', trend: 'up', icon: 'users', color: '#FB8832' },
    { id: 'activeRiders', label: 'Active Riders', subtitle: 'Online now', primary: '78', growth: '+9 online', trend: 'up', icon: 'user-plus', color: '#7C3AED', extra: 'Deliveries today: 426 | On-time: 92%' },
    { id: 'customers', label: 'Customers', subtitle: 'Total / New this week', primary: '58,240 / 1,248', growth: '+2.1%', trend: 'up', icon: 'users', color: '#10B981', extra: 'Repeat: 47%' },
    { id: 'liveOrders', label: 'Pending / Live Orders', subtitle: 'Accepted / Picked', primary: '36 / 21', growth: '-', trend: 'up', icon: 'trending-up', color: '#F59E0B', action: true },
    { id: 'cancellations', label: 'Cancellations & Refunds', subtitle: 'Today', primary: '8', growth: 'Refunds: $320', trend: 'down', icon: 'thumbs-up', color: '#EF4444' },
    { id: 'topZone', label: 'Top Performing Area', subtitle: 'Today', primary: 'Sector 22, CHD', growth: 'Orders: 96', trend: 'up', icon: 'trending-up', color: '#0EA5E9' },
    { id: 'avgDelivery', label: 'Average Delivery Time', subtitle: 'Current vs Target', primary: '28m / 20m', growth: '+8m over', trend: 'down', icon: 'arrow-down', color: '#F97316' },
    { id: 'ratings', label: 'Ratings & Feedback', subtitle: 'Avg rating / Feedbacks', primary: '4.4 / 182', growth: 'This week', trend: 'up', icon: 'heart', color: '#22C55E' }
  ];

  // Chart options for the SLRATER performance chart
  const chartOptions = {
    chart: {
      type: 'area',
      height: 250,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      background: 'transparent'
    },
    colors: ['#088B46', '#36BFFA', '#FB8832'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#777'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#777'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  // Chart series data (Orders, Revenue, Avg Delivery Time)
  const chartSeries = [
    {
      name: 'Orders',
      data: [220, 260, 240, 280, 300, 320, 350, 370, 340, 360, 380, 400]
    },
    {
      name: 'Revenue',
      data: [1232, 1345, 3314, 1678, 1890, 2012, 2234, 2456, 2345, 2567, 2789, 3012]
    },
    {
      name: 'Avg Delivery (min)',
      data: [32, 31, 30, 29, 28, 27, 28, 29, 27, 26, 28, 27]
    }
  ];

  return (
    <div className="slrater-component" style={{ marginBottom: '24px' }}>
      <Card bordered={false}>
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>SLRATER Performance</h5>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>Sales, Leads, Retention, Acquisition, Traffic, Engagement, Revenue</p>
            </div>
            <div>
              <Space>
                <Button icon={<Download size={16} />} type="default" size="small">
                  Export
                </Button>
                <Button icon={<RefreshCw size={16} />} type="primary" size="small">
                  Update
                </Button>
              </Space>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px' }}>
          {/* Metrics Row - Admin Home Stats */}
          <div style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              {stats.map((card) => {
                const getIcon = () => {
                  switch(card.icon) {
                    case 'dollar': return <DollarSign size={16} />;
                    case 'user-plus': return <UserPlus size={16} />;
                    case 'heart': return <Heart size={16} />;
                    case 'users': return <Users size={16} />;
                    case 'trending-up': return <TrendingUp size={16} />;
                    case 'thumbs-up': return <ThumbsUp size={16} />;
                    case 'briefcase': return <Briefcase size={16} />;
                    case 'arrow-down': return <ArrowDown size={16} />;
                    default: return <TrendingUp size={16} />;
                  }
                };
                const trendBg = card.trend === 'up' ? '#e6f7ef' : card.trend === 'down' ? '#fff1f0' : '#f5f5f5';
                const trendColor = card.trend === 'up' ? '#52c41a' : card.trend === 'down' ? '#f5222d' : '#8c8c8c';
                return (
                  <Col key={card.id} xs={24} sm={12} md={12} lg={8} xl={6} style={{ marginBottom: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h6 style={{ margin: '0 0 2px 0', color: '#8c8c8c', fontSize: '13px' }}>{card.label}</h6>
                          {card.subtitle && <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{card.subtitle}</div>}
                          <h4 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 600 }}>{card.primary}</h4>
                        </div>
                        <div style={{ 
                          backgroundColor: `${card.color}15`, 
                          borderRadius: '50%', 
                          width: '40px', 
                          height: '40px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <span style={{ color: card.color }}>
                            {getIcon()}
                          </span>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ 
                            backgroundColor: trendBg, 
                            color: trendColor,
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}>
                            {card.trend === 'up' ? <ArrowUp size={12} style={{ marginRight: 4 }} /> : card.trend === 'down' ? <ArrowDown size={12} style={{ marginRight: 4 }} /> : null}
                            {card.growth}
                          </span>
                          {card.extra && (
                            <span style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 8 }}>{card.extra}</span>
                          )}
                        </div>
                        {card.action && (
                          <Button size="small" type="primary">Assign Rider</Button>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Chart */}
          <div className="slrater-chart">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={250}
            />
          </div>

          {/* Summary Stats */}
          <div style={{ marginTop: '24px' }}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={8}>
                <div style={{ 
                  textAlign: 'center', 
                  borderRight: { xs: 'none', sm: 'none', md: '1px solid #f0f0f0' },
                  height: '100%',
                  padding: '16px'
                }}>
                  <h6 style={{ margin: '0 0 4px 0', color: '#8c8c8c', fontSize: '14px' }}>Overall Growth</h6>
                  <h3 style={{ margin: 0, color: '#088B46', fontSize: '24px', fontWeight: '600' }}>+15.8%</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: '12px' }}>Compared to previous quarter</p>
                </div>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <div style={{ 
                  textAlign: 'center', 
                  borderRight: { xs: 'none', sm: 'none', md: '1px solid #f0f0f0' },
                  height: '100%',
                  padding: '16px'
                }}>
                  <h6 style={{ margin: '0 0 4px 0', color: '#8c8c8c', fontSize: '14px' }}>Conversion Rate</h6>
                  <h3 style={{ margin: 0, color: '#088B46', fontSize: '24px', fontWeight: '600' }}>8.5%</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: '12px' }}>Industry avg: 5.8%</p>
                </div>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <div style={{ 
                  textAlign: 'center',
                  height: '100%',
                  padding: '16px'
                }}>
                  <h6 style={{ margin: '0 0 4px 0', color: '#8c8c8c', fontSize: '14px' }}>Customer LTV</h6>
                  <h3 style={{ margin: 0, color: '#088B46', fontSize: '24px', fontWeight: '600' }}>$1,250</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: '12px' }}>+12% year over year</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SlraterComponent;