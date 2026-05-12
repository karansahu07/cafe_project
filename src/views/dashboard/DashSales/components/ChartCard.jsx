import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import Chart from 'react-apexcharts';
import { Download, Eye, BarChart2, PieChart, LineChart } from 'lucide-react';

const ChartCard = ({ title, subtitle, chartData, chartType = 'line', showLegend = true, actions }) => {
  return (
    <Card className="chart-card shadow-sm mb-4" bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{title}</h5>
          {subtitle && <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>{subtitle}</p>}
        </div>
        {actions && (
          <Space>
            {actions.map((action, index) => {
              const getIcon = () => {
                switch(action.icon) {
                  case 'download': return <Download size={16} />;
                  case 'visibility': return <Eye size={16} />;
                  default: return null;
                }
              };
              
              return (
                <Button 
                  key={index} 
                  type="text" 
                  size="small" 
                  onClick={action.onClick}
                  icon={getIcon()}
                >
                  {action.label}
                </Button>
              );
            })}
          </Space>
        )}
      </div>
        
        {chartData.summary && (
          <Row gutter={[16, 16]} className="chart-summary" style={{ marginBottom: '16px' }}>
            {chartData.summary.map((item, index) => (
              <Col key={index} xs={12} sm={12} md={8} lg={8} xl={8}>
                <div className="summary-item">
                  <h3 style={{ margin: '0 0 4px 0', color: item.color || '#961818', fontSize: '20px', fontWeight: '600' }}>{item.value}</h3>
                  <span style={{ color: '#8c8c8c', fontSize: '14px' }}>{item.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        )}
        
        <div className="chart-container">
          <Chart 
            type={chartType} 
            height={chartData.height || 350} 
            options={{
              ...chartData.options,
              theme: {
                ...chartData.options.theme,
                monochrome: {
                  enabled: true,
                  color: '#961818',
                  shadeTo: 'light',
                  shadeIntensity: 0.65
                }
              },
              colors: chartData.options.colors || ['#961818', '#baf7d7', '#e6f7ef'],
              chart: {
                ...chartData.options.chart,
                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                  },
                  autoSelected: 'zoom'
                },
                animations: {
                  enabled: true,
                  easing: 'easeinout',
                  speed: 800,
                  animateGradually: {
                    enabled: true,
                    delay: 150
                  },
                  dynamicAnimation: {
                    enabled: true,
                    speed: 350
                  }
                }
              },
              legend: {
                show: showLegend,
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                  width: 12,
                  height: 12,
                  radius: 6
                },
                itemMargin: {
                  horizontal: 10,
                  vertical: 8
                }
              },
              grid: {
                borderColor: '#f5f5f5',
                strokeDashArray: 4,
                xaxis: {
                  lines: {
                    show: true
                  }
                },
                padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 10
                }
              },
              tooltip: {
                theme: 'light',
                marker: {
                  show: true,
                },
                x: {
                  show: true,
                }
              }
            }}
            series={chartData.series}
          />
        </div>
    </Card>
  );
};

export default ChartCard;