import React from 'react';
import { Row, Col, Card } from 'antd';
import Chart from 'react-apexcharts';

// Custom components
import StatCard from './components/StatCard';
import SummaryCard from './components/SummaryCard';
import ChartCard from './components/ChartCard';
import DataTable from './components/DataTable';
import Slider from './components/Slider';
import SlraterComponent from './components/SlraterComponent';

// Chart data
import { SalesCustomerSatisfactionChartData } from './chart/sales-customer-satisfication-chart';
import { SalesAccountChartData } from './chart/sales-account-chart';
import { SalesSupportChartData } from './chart/sales-support-chart';
import { SalesSupportChartData1 } from './chart/sales-support-chart1';

// Data
import feedData from 'data/feedData';
import productData from 'data/productTableData';

// Styles
import './components/styles.css';

// -----------------------|| DASHBOARD SALES ||-----------------------//
export default function DashSales() {
  // Sample slider data
  const sliderItems = [
    {
      title: 'Sales Performance Overview',
      description: 'Track your sales performance metrics and growth trends at a glance.',
      stats: [
        { icon: 'trending_up', value: '+12.5%', label: 'Growth Rate' },
        { icon: 'people', value: '1,245', label: 'New Customers' },
        { icon: 'shopping_cart', value: '3,550', label: 'Total Orders' },
        { icon: 'payments', value: '$21,356', label: 'Revenue' }
      ],
      image: '/assets/images/dashboard/sales-overview.svg'
    },
    {
      title: 'Customer Satisfaction',
      description: 'Our customer satisfaction rate has increased by 15% in the last quarter.',
      stats: [
        { icon: 'star', value: '4.8/5', label: 'Rating' },
        { icon: 'support_agent', value: '98%', label: 'Support Quality' },
        { icon: 'repeat', value: '2.3%', label: 'Return Rate' },
        { icon: 'thumb_up', value: '96%', label: 'Satisfaction' }
      ],
      image: '/assets/images/dashboard/customer-satisfaction.svg'
    },
    {
      title: 'Product Performance',
      description: 'Monitor your top-performing products and categories.',
      stats: [
        { icon: 'inventory_2', value: '6,784', label: 'Products Sold' },
        { icon: 'category', value: '12', label: 'Categories' },
        { icon: 'local_offer', value: '$6,780', label: 'Avg. Price' },
        { icon: 'trending_up', value: '+8.4%', label: 'Growth' }
      ],
      image: '/assets/images/dashboard/product-performance.svg'
    }
  ];

  // Sample table data
  const recentOrdersColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer', 
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.avatar && <img src={row.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }} />}
          <div>
            <div style={{ fontWeight: 500 }}>{row.customer}</div>
            {row.email && <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{row.email}</div>}
          </div>
        </div>
      ) 
    },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  const recentOrdersData = feedData.options.slice(0, 5).map(item => ({
    id: `ORD-${Math.floor(Math.random() * 10000)}`,
    customer: item.heading.split('.')[0],
    avatar: null,
    email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
    date: item.publishon || new Date().toLocaleDateString(),
    amount: `$${Math.floor(Math.random() * 1000) + 100}`,
    status: ['Completed', 'Pending', 'Processing', 'Cancelled'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="dashboard-container p2" >
      {/* Slider Section */}
     
      
      {/* SLRATER Component */}
      <Row gutter={[16, 24]} >
        <Col xs={24} sm={24} md={24} lg={24}>
          <SlraterComponent />
        </Col>
      </Row>

      <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Slider items={sliderItems} />
        </Col>
      </Row>

    {/* Stats Overview */}
      <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        
        <Col  xs={24} sm={12} md={6} lg={6}>
          <StatCard 
            title="Total Customers" 
            value="1,000" 
            icon="users" 
            trend="up"
            trendValue="+15%"
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <StatCard 
            title="Total Revenue" 
            value="$21,356" 
            icon="dollar-sign" 
            trend="up"
            trendValue="+8.5%"
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <StatCard 
            title="Total Orders" 
            value="15,830" 
            icon="shopping-bag" 
            trend="up"
            trendValue="+12.3%"
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <StatCard 
            title="Average Order Value" 
            value="$135" 
            icon="trending-up" 
            trend="down"
            trendValue="-2.4%"
          />
        </Col>
      </Row>





      {/* Sales Summary */}
      {/* <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <ChartCard 
            title="Monthly Sales Performance"
            subtitle="Department wise monthly sales report"
            chartData={{
              ...SalesAccountChartData(),
              summary: [
                { label: 'Total Sales', value: '$21,356.46' },
                { label: 'Average', value: '$1,935.6' }
              ]
            }}
            actions={[
              { label: 'Export', icon: 'download', onClick: () => console.log('Export clicked') },
              { label: 'Details', icon: 'eye', onClick: () => console.log('Details clicked') }
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className="support-bar" style={{ overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                <div style={{ paddingBottom: 0 }}>
                  <h2 style={{ margin: 0 }}>53.94%</h2>
                  <span style={{ color: '#088B46' }}>Conversion Rate</span>
                  <p style={{ marginBottom: '12px', marginTop: '12px' }}>Number of conversions divided by the total visitors.</p>
                </div>
                <Chart {...SalesSupportChartData()} />
                <div style={{ backgroundColor: '#088B46', color: 'white', padding: '16px' }}>
                  <Row gutter={8} style={{ textAlign: 'center' }}>
                    <Col span={8}>
                      <h4 style={{ margin: 0, color: 'white' }}>10</h4>
                      <span>2022</span>
                    </Col>
                    <Col span={8}>
                      <h4 style={{ margin: 0, color: 'white' }}>15</h4>
                      <span>2023</span>
                    </Col>
                    <Col span={8}>
                      <h4 style={{ margin: 0, color: 'white' }}>20</h4>
                      <span>2024 (Est.)</span>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className="support-bar" style={{ overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                <div style={{ paddingBottom: 0 }}>
                  <h2 style={{ margin: 0 }}>1,432</h2>
                  <span style={{ color: '#088B46' }}>Orders Delivered</span>
                  <p style={{ marginBottom: '12px', marginTop: '12px' }}>Successfully completed and delivered orders this quarter.</p>
                </div>
                <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <Row gutter={8} style={{ textAlign: 'center' }}>
                    <Col span={8}>
                      <h4 style={{ margin: 0 }}>430</h4>
                      <span>May</span>
                    </Col>
                    <Col span={8}>
                      <h4 style={{ margin: 0 }}>451</h4>
                      <span>June</span>
                    </Col>
                    <Col span={8}>
                      <h4 style={{ margin: 0 }}>551</h4>
                      <span>July</span>
                    </Col>
                  </Row>
                </div>
                <Chart type="bar" {...SalesSupportChartData1()} />
              </Card>
            </Col>
          </Row>
          <SummaryCard 
            title="Performance Metrics"
            metrics={[
              { label: 'Total Growth', value: '600', icon: 'trending-up' },
              { label: 'Returns', value: '3,550', icon: 'refresh-cw', trend: { direction: 'down', value: '-5%' } },
              { label: 'Downloads', value: '3,550', icon: 'download-cloud', trend: { direction: 'up', value: '+12%' } },
              { label: 'Completion', value: '100%', icon: 'check-circle' }
            ]}
          />
        </Col>
      </Row> */}

      {/* Customer Satisfaction & Recent Orders */}
      {/* <Row gutter={[16, 24]}>
        <Col xs={24} sm={24} md={10} lg={10}>
          <ChartCard 
            title="Customer Satisfaction"
            subtitle="Internal and external satisfaction levels"
            chartType="pie"
            chartData={{
              ...SalesCustomerSatisfactionChartData(),
              height: 300
            }}
          />
        </Col>
        <Col xs={24} sm={24} md={14} lg={14}>
          <DataTable 
            title="Recent Orders"
            columns={recentOrdersColumns}
            data={recentOrdersData}
            actions={[
              { label: 'View All', icon: 'eye', onClick: () => console.log('View all clicked') },
              { label: 'Export', icon: 'download', onClick: () => console.log('Export clicked') }
            ]}
          />
        </Col>
      </Row> */}
    </div>
  );
}
