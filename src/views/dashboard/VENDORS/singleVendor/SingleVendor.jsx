// // react-bootstrap
// import { Row, Col, Card } from 'react-bootstrap';

// // third party
// import Chart from 'react-apexcharts';

// // project imports
// import FlatCard from 'components/Widgets/Statistic/FlatCard';
// import ProductCard from 'components/Widgets/Statistic/ProductCard';
// import FeedTable from 'components/Widgets/FeedTable';
// import ProductTable from 'components/Widgets/ProductTable';
// import { SalesCustomerSatisfactionChartData } from '../../DashSales/chart/sales-customer-satisfication-chart';
// import { SalesAccountChartData } from '../../DashSales/chart/sales-account-chart';
// import { SalesSupportChartData } from '../../DashSales/chart/sales-support-chart';

// import feedData from 'data/feedData';
// import productData from 'data/productTableData';
// import { SalesSupportChartData1 } from '../../DashSales/chart/sales-support-chart1';

// // -----------------------|| DASHBOARD SALES ||-----------------------//
// export default function SingleVendor() {
//   return (
//     <Row className='p2'>
//       <Col md={12} xl={6}>
//         <Card className="flat-card">
//           <div className="row-table">
//             <Card.Body className="col-sm-6 br">
//               <FlatCard params={{ title: 'Customers', iconClass: 'text-primary mb-1', icon: 'group', value: '1000' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
//               <FlatCard params={{ title: 'Revenue', iconClass: 'text-primary mb-1', icon: 'language', value: '1252' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 card-bod">
//               <FlatCard params={{ title: 'Growth', iconClass: 'text-primary mb-1', icon: 'unarchive', value: '600' }} />
//             </Card.Body>
//           </div>
//           <div className="row-table">
//             <Card.Body className="col-sm-6 br">
//               <FlatCard
//                 params={{
//                   title: 'Returns',
//                   iconClass: 'text-primary mb-1',
//                   icon: 'swap_horizontal_circle',
//                   value: '3550'
//                 }}
//               />
//             </Card.Body>
//             <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
//               <FlatCard params={{ title: 'Downloads', iconClass: 'text-primary mb-1', icon: 'cloud_download', value: '3550' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 card-bod">
//               <FlatCard params={{ title: 'Order', iconClass: 'text-primary mb-1', icon: 'shopping_cart', value: '100%' }} />
//             </Card.Body>
//           </div>
//         </Card>
//         <Row>
//           <Col md={6}>
//             <Card className="support-bar overflow-hidden">
//               <Card.Body className="pb-0">
//                 <h2 className="m-0">53.94%</h2>
//                 <span className="text-primary">Conversion Rate</span>
//                 <p className="mb-3 mt-3">Number of conversions divided by the total visitors. </p>
//               </Card.Body>
//               <Chart {...SalesSupportChartData()} />
//               <Card.Footer className="border-0 bg-primary text-white background-pattern-white">
//                 <Row className="text-center">
//                   <Col>
//                     <h4 className="m-0 text-white">10</h4>
//                     <span>2018</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 text-white">15</h4>
//                     <span>2017</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 text-white">13</h4>
//                     <span>2016</span>
//                   </Col>
//                 </Row>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col md={6}>
//             <Card className="support-bar overflow-hidden">
//               <Card.Body className="pb-0">
//                 <h2 className="m-0">1432</h2>
//                 <span className="text-primary">Order Delivered</span>
//                 <p className="mb-3 mt-3">Number of conversions divided by the total visitors. </p>
//               </Card.Body>
//               <Card.Footer className="border-0">
//                 <Row className="text-center">
//                   <Col>
//                     <h4 className="m-0">130</h4>
//                     <span>May</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0">251</h4>
//                     <span>June</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 ">235</h4>
//                     <span>July</span>
//                   </Col>
//                 </Row>
//               </Card.Footer>
//               <Chart type="bar" {...SalesSupportChartData1()} />
//             </Card>
//           </Col>
//         </Row>
//       </Col>
//       <Col md={12} xl={6}>
//         <Card>
//           <Card.Header>
//             <h5>Department wise monthly sales report</h5>
//           </Card.Header>
//           <Card.Body>
//             <Row className="pb-2">
//               <div className="col-auto m-b-10">
//                 <h3 className="mb-1">$21,356.46</h3>
//                 <span>Total Sales</span>
//               </div>
//               <div className="col-auto m-b-10">
//                 <h3 className="mb-1">$1935.6</h3>
//                 <span>Average</span>
//               </div>
//             </Row>
//             <Chart {...SalesAccountChartData()} />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={12} xl={6}>
//         <Card>
//           <Card.Body>
//             <h6>Customer Satisfaction</h6>
//             <span>It takes continuous effort to maintain high customer satisfaction levels Internal and external.</span>
//             <Row className="d-flex justify-content-center align-items-center">
//               <Col>
//                 <Chart type="pie" {...SalesCustomerSatisfactionChartData()} />
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//         {/* Product Table */}
//         <ProductTable {...productData} />
//       </Col>
//       <Col md={12} xl={6}>
//         <Row>
//           <Col sm={6}>
//             <ProductCard params={{ title: 'Total Profit', primaryText: '$1,783', icon: 'card_giftcard' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ variant: 'primary', title: 'Total Orders', primaryText: '15,830', icon: 'local_mall' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ variant: 'primary', title: 'Average Price', primaryText: '$6,780', icon: 'monetization_on' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ title: 'Product Sold', primaryText: '6,784', icon: 'local_offer' }} />
//           </Col>
//         </Row>
//         {/* Feed Table */}
//         <FeedTable {...feedData} />
//       </Col>
//     </Row>
//   );
// }







import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Badge, Button, Statistic, Table, Progress, DatePicker, message, Spin, Image, Select, Typography, Avatar, Divider, Space, Tag } from 'antd';
import DateRangeSelector from '../../../../components/DateRangeSelector';
import { useParams } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  FileText,
  Banknote,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Truck,
  AlertCircle,
  Award,
  Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import dayjs from 'dayjs';
import { getVendorAnalytics, getVendorById } from '../../../../services/apiService';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Theme palette
const THEME = {
  primary: '#961818',
  secondary: '#0AA95A',
  warning: '#faad14',
  danger: '#f5222d',
  success: '#52c41a',
  info: '#1890ff',
  background: '#f0f2f5',
  cardBackground: '#ffffff',
  textPrimary: '#000000',
  textSecondary: '#8c8c8c',
  border: '#f0f0f0'
};

// Custom styles
const styles = {
  pageHeader: {
    padding: '16px 0',
    background: THEME.cardBackground,
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  },
  statCard: {
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  },
  chartCard: {
    marginBottom: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  },
  tabsContainer: {
    marginBottom: '24px',
    background: THEME.cardBackground,
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    marginRight: '16px'
  }
};

const VendorDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState("1");
  const [analyticsView, setAnalyticsView] = useState('daily');
  const [rangeLoading, setRangeLoading] = useState(false);
  const [selectedStart, setSelectedStart] = useState(dayjs().startOf('day'));
  const [selectedEnd, setSelectedEnd] = useState(dayjs().endOf('day'));
  const [tempStart, setTempStart] = useState(dayjs().startOf('day'));
  const [tempEnd, setTempEnd] = useState(dayjs().endOf('day'));
  const [rangeData, setRangeData] = useState([]);
  const [rangeTotals, setRangeTotals] = useState({ earnings: 0, orders: 0, customers: 0 });
  const [rangePreviousTotals, setRangePreviousTotals] = useState({ earnings: 0, orders: 0, customers: 0 });
  const [overviewTotals, setOverviewTotals] = useState({ earnings: 0, orders: 0, customers: 0 });
  const [overviewPreviousTotals, setOverviewPreviousTotals] = useState({ earnings: 0, orders: 0, customers: 0 });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewData, setOverviewData] = useState([]);
  const [datePreset, setDatePreset] = useState('today');
  // Using AntD Image built-in preview; no custom modal
  
  // Local DateRangeSelector component has been removed in favor of the imported one
  

  const params = useParams();
  const routeVendorId = params?.vendorId || params?.id || window.location.pathname.split('/').pop();
  const vendorIdNumber = Number(routeVendorId);

  // Vendor data (fetched dynamically)
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      if (!vendorIdNumber) return;
      setLoading(true);
      try {
        const res = await getVendorById(vendorIdNumber);
        if (res?.success && res?.data) {
          setVendorData(res.data);
        } else {
          message.error(res?.message || 'Failed to fetch vendor');
        }
      } catch (error) {
        message.error('Error fetching vendor data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadVendor();
  }, [vendorIdNumber]);

  // Sample analytics data
  const analyticsData = {
    daily: [
      { period: '2025-07-12', earnings: 1250, orders: 18, customers: 15 },
      { period: '2025-07-13', earnings: 1890, orders: 25, customers: 22 },
      { period: '2025-07-14', earnings: 2100, orders: 31, customers: 28 },
      { period: '2025-07-15', earnings: 1650, orders: 20, customers: 18 },
      { period: '2025-07-16', earnings: 2350, orders: 35, customers: 32 },
      { period: '2025-07-17', earnings: 1980, orders: 28, customers: 25 },
      { period: '2025-07-18', earnings: 2450, orders: 38, customers: 35 }
    ],
    weekly: [
      { period: 'Week 1', earnings: 8950, orders: 142, customers: 128 },
      { period: 'Week 2', earnings: 12400, orders: 186, customers: 165 },
      { period: 'Week 3', earnings: 15200, orders: 225, customers: 198 },
      { period: 'Week 4', earnings: 18750, orders: 267, customers: 235 },
      { period: 'Week 5', earnings: 21300, orders: 298, customers: 268 },
      { period: 'Week 6', earnings: 19800, orders: 278, customers: 245 }
    ],
    monthly: [
      { period: 'Jan', earnings: 45200, orders: 650, customers: 580 },
      { period: 'Feb', earnings: 52800, orders: 720, customers: 645 },
      { period: 'Mar', earnings: 48900, orders: 695, customers: 612 },
      { period: 'Apr', earnings: 56700, orders: 785, customers: 698 },
      { period: 'May', earnings: 62400, orders: 865, customers: 756 },
      { period: 'Jun', earnings: 58900, orders: 825, customers: 724 },
      { period: 'Jul', earnings: 65200, orders: 892, customers: 798 }
    ],
    quarterly: [
      { period: 'Q1 2024', earnings: 146900, orders: 2065, customers: 1837 },
      { period: 'Q2 2024', earnings: 178000, orders: 2475, customers: 2178 },
      { period: 'Q3 2024', earnings: 195400, orders: 2698, customers: 2385 },
      { period: 'Q4 2024', earnings: 212800, orders: 2856, customers: 2534 },
      { period: 'Q1 2025', earnings: 189100, orders: 2582, customers: 2298 }
    ]
  };

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#1890ff' },
    { name: 'Clothing', value: 25, color: '#52c41a' },
    { name: 'Home & Garden', value: 20, color: '#faad14' },
    { name: 'Books', value: 12, color: '#f5222d' },
    { name: 'Sports', value: 8, color: '#722ed1' }
  ];

  const isSameDay = selectedStart && selectedEnd && selectedStart.isSame(selectedEnd, 'day');
  const getCurrentData = () => analyticsData[analyticsView];

  const fetchAnalytics = async (start, end) => {
    if (!start || !end) return;
    setRangeLoading(true);
    const res = await getVendorAnalytics(
      vendorIdNumber,
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD')
    );
    if (res.success) {
      const dataArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
      const totalsObj = (res.totals ?? res?.data?.totals) || { earnings: 0, orders: 0, customers: 0 };
      const previousTotalsObj = (res.previousTotals ?? res?.data?.previousTotals) || { earnings: 0, orders: 0, customers: 0 };

     console.log(res,totalsObj, previousTotalsObj);
     

      setRangeData(dataArray);
      setRangeTotals({
        earnings: Number(totalsObj.earnings || 0),
        orders: Number(totalsObj.orders || 0),
        customers: Number(totalsObj.customers || 0),
      });
      setRangePreviousTotals({
        earnings: Number(previousTotalsObj.earnings || 0),
        orders: Number(previousTotalsObj.orders || 0),
        customers: Number(previousTotalsObj.customers || 0),
      });
    } else {
      message.error(res.error?.message || 'Failed to load analytics');
      setRangeData([]);
      setRangeTotals({ earnings: 0, orders: 0, customers: 0 });
      setRangePreviousTotals({ earnings: 0, orders: 0, customers: 0 });
    }
    setRangeLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics(selectedStart, selectedEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorIdNumber]);

  // Fetch current week for Overview tab
  useEffect(() => {
    const fetchOverview = async () => {
      if (!vendorIdNumber) return;
      setOverviewLoading(true);
      const start = dayjs().startOf('week');
      const end = dayjs().endOf('week');
      try {
        const res = await getVendorAnalytics(
          vendorIdNumber,
          start.format('YYYY-MM-DD'),
          end.format('YYYY-MM-DD')
        );
        if (res?.success) {
          const dataArray = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res?.data?.data)
              ? res.data.data
              : [];
          setOverviewData(dataArray);
          const totalsObj = (res.totals ?? res?.data?.totals) || { earnings: 0, orders: 0, customers: 0 };
          const previousTotalsObj = (res.previousTotals ?? res?.data?.previousTotals) || { earnings: 0, orders: 0, customers: 0 };
          setOverviewTotals({
            earnings: Number(totalsObj.earnings || 0),
            orders: Number(totalsObj.orders || 0),
            customers: Number(totalsObj.customers || 0),
          });
          setOverviewPreviousTotals({
            earnings: Number(previousTotalsObj.earnings || 0),
            orders: Number(previousTotalsObj.orders || 0),
            customers: Number(previousTotalsObj.customers || 0),
          });
        } else {
          setOverviewData([]);
          setOverviewTotals({ earnings: 0, orders: 0, customers: 0 });
          setOverviewPreviousTotals({ earnings: 0, orders: 0, customers: 0 });
        }
      } catch (error) {
        message.error('Error fetching overview data');
        console.error(error);
        setOverviewData([]);
        setOverviewTotals({ earnings: 0, orders: 0, customers: 0 });
        setOverviewPreviousTotals({ earnings: 0, orders: 0, customers: 0 });
      } finally {
        setOverviewLoading(false);
      }
    };
    fetchOverview();
  }, [vendorIdNumber]);

  const mappedOverviewData = overviewData.map((d) => ({
    label: dayjs(d.order_date).format('ddd DD'),
    earnings: Number(d.total_earning || 0),
    orders: Number(d.total_orders || 0),
    customers: Number(d.total_customers || 0),
  }));

  // presetsTreeData removed; handled by reusable DateRangeSelector

  const mappedRangeData = (isSameDay ? rangeData.map((d) => ({
    label: `${d.order_hour}:00`,
    earnings: Number(d.total_earning || 0),
    orders: Number(d.total_orders || 0),
    customers: Number(d.total_customers || 0),
  })) : rangeData.map((d) => ({
    label: dayjs(d.order_date).format('YYYY-MM-DD'),
    earnings: Number(d.total_earning || 0),
    orders: Number(d.total_orders || 0),
    customers: Number(d.total_customers || 0),
  })));
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format number with commas
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const rangeSummary = {
    totalEarnings: mappedRangeData.reduce((s, x) => s + x.earnings, 0),
    totalOrders: mappedRangeData.reduce((s, x) => s + x.orders, 0),
    totalCustomers: mappedRangeData.reduce((s, x) => s + x.customers, 0),
  };

  // Prefer API totals; if they are zero but we have chart data, fallback to computed summary
  const hasApiTotals = (rangeTotals.earnings || rangeTotals.orders || rangeTotals.customers);
  const effectiveTotals = hasApiTotals ? rangeTotals : {
    earnings: Number(rangeSummary.totalEarnings || 0),
    orders: Number(rangeSummary.totalOrders || 0),
    customers: Number(rangeSummary.totalCustomers || 0),
  };

  const calculateTrend = (current = 0, previous = 0) => {
    const safeCurrent = Number(current || 0);
    const safePrevious = Number(previous || 0);
    const delta = safeCurrent - safePrevious;
    const trend = delta >= 0 ? 'up' : 'down';
    // Show percentage change relative to previous: (current - previous) / previous * 100
    let changePercent = 0;
    if (safePrevious > 0) {
      changePercent = (delta / safePrevious) * 100;
    } else {
      // If previous is 0: any positive current is +100%, otherwise 0%
      changePercent = safeCurrent > 0 ? 100 : 0;
    }
    return { trend, percentText: `${changePercent.toFixed(1)}%` };
  };
  
  // Stat Card Component
  const StatCard = ({ title, value, icon, trend, trendValue, color = THEME.primary, suffix = "" }) => {
    return (
      <Card style={styles.statCard}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: `${color}15` }}>
            {icon}
          </div>
          <div>
            <Text type="secondary">{title}</Text>
            <Title level={4} style={{ margin: 0 }}>
              {value}{suffix}
              {trend && (
                <span style={{ 
                  fontSize: '14px', 
                  marginLeft: '8px',
                  color: trend === 'up' ? THEME.success : THEME.danger 
                }}>
                  {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {trendValue}
                </span>
              )}
            </Title>
          </div>
        </div>
      </Card>
    );
  };

  const computeRangeFromPreset = (presetKey) => {
    const today = dayjs();
    switch (presetKey) {
      case 'today':
        return { start: today.startOf('day'), end: today.endOf('day') };
      case 'yesterday': {
        const y = today.subtract(1, 'day');
        return { start: y.startOf('day'), end: y.endOf('day') };
      }
      case 'this_week':
        return { start: today.startOf('week'), end: today.endOf('week') };
      case 'last_week': {
        const start = today.startOf('week').subtract(1, 'week');
        const end = today.endOf('week').subtract(1, 'week');
        return { start, end };
      }
      case 'this_month':
        return { start: today.startOf('month'), end: today.endOf('month') };
      case 'current_financial_year': {
        // Assuming financial year starts on April 1
        const year = today.month() >= 3 ? today.year() : today.year() - 1;
        const start = dayjs(`${year}-04-01`).startOf('day');
        const end = dayjs(`${year + 1}-03-31`).endOf('day');
        return { start, end };
      }
      case 'custom':
      default:
        return { start: tempStart, end: tempEnd };
    }
  };

  const getTotalEarnings = () => {
    return getCurrentData().reduce((sum, item) => sum + item.earnings, 0);
  };

  const getTotalOrders = () => {
    return getCurrentData().reduce((sum, item) => sum + item.orders, 0);
  };

  // Document status data
  const documentColumns = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Uploaded' ? 'success' : 'warning'} 
          text={status}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.url ? (
          <Image
            src={record.url}
            width={64}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={{
              zIndex: 3000,
            }}
          />
        ) : (
          <span style={{ color: '#999' }}>Upload</span>
        )
      ),
    },
  ];

  // documentData computed inline in Table to avoid null access before fetch

  // const StatCard = ({ title, value, icon, trend, trendValue, color = THEME.primary, suffix = "" }) => (
  //   <Card className="mb-2" style={{ borderLeft: `4px solid ${color}`, padding: '4px 8px' }}>
  //     <Statistic
  //       title={title}
  //       value={value}
  //       suffix={suffix}
  //       prefix={icon}
  //       valueStyle={{ color: '#000', fontWeight: 700 }}
  //     />
  //     {trend && (
  //       <div className="mt-2">
  //         <span style={{ color: trend === 'up' ? THEME.primary : THEME.danger, }}>
  //           {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
  //           {' '}{trendValue}
  //         </span>
  //       </div>
  //     )}
  //   </Card>
  // );

  // The duplicate StatCard component has been completely removed
  
  
  
  

  const InfoRow = ({ icon, label, value }) => (
    <div className="d-flex align-items-center mb-3">
      <div className="me-3" style={{ color: THEME.primary }}>
        {icon}
      </div>
      <div>
        <div className="fw-bold">{value}</div>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );

  return (
    <div className='p2' style={{ backgroundColor: '#f0f2f5',  }}>
      {/* Header */}
      <Card  bodyStyle={{padding:6}} style={{ borderRadius: '0' ,padding:6}}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="d-flex align-items-center">
              <div 
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: THEME.primary,
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                {vendorData?.profile_pic ? (
                  <img src={vendorData.profile_pic} alt="Profile" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} />
                ) : (
                  <span>{vendorData?.firstname?.[0]?.toUpperCase()}{vendorData?.lastname?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="mb-1">{vendorData?.store_name || '-'}</h3>
                <p className="text-muted mb-0">ID: {vendorData?.custom_id || '-'}</p>
              </div>
            </div>
          </Col>
          <Col>
            <Badge 
              status={vendorData?.is_verified === 1 ? 'success' : 'warning'}
              text={vendorData?.is_verified === 1 ? 'Verified' : 'Pending Verification'}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <div className="contai44ner-fluid">
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarStyle={{backgroundColor:"white",paddingLeft:10}} size="large">
          {/* Overview Tab */}
          <TabPane tab={<span><Eye size={16} /> Overview</span>} key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Earnings"
                  value={Number(overviewTotals.earnings || 0)}
                  icon={<DollarSign size={16} />}
                  trend={calculateTrend(overviewTotals.earnings, overviewPreviousTotals.earnings).trend}
                  trendValue={calculateTrend(overviewTotals.earnings, overviewPreviousTotals.earnings).percentText}
                  color={THEME.primary}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Orders"
                  value={Number(overviewTotals.orders || 0)}
                  icon={<ShoppingCart size={16} />}
                  trend={calculateTrend(overviewTotals.orders, overviewPreviousTotals.orders).trend}
                  trendValue={calculateTrend(overviewTotals.orders, overviewPreviousTotals.orders).percentText}
                  color={THEME.primary}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Active Products"
                  value={142}
                  icon={<Package size={16} />}
                  trend={undefined}
                  trendValue={undefined}
                  color={THEME.primary}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Customer Rating"
                  value={4.8}
                  icon={<Star size={16} />}
                  trend={undefined}
                  trendValue={undefined}
                  color={THEME.warning}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card title="Daily Earnings Trend" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mappedOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="earnings" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Sales by Category" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Owner & Store Details Tab */}
          <TabPane tab={<span><User size={16} /> Owner & Store Details</span>} key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Personal Information" className="h-100">
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Full Name"
                    value={`${vendorData?.firstname || ''} ${vendorData?.lastname || ''}`.trim()}
                  />
                  <InfoRow 
                    icon={<Mail size={16} />}
                    label="Email Address"
                    value={vendorData?.email || '-'}
                  />
                  <InfoRow 
                    icon={<Phone size={16} />}
                    label="Phone Number"
                    value={`${vendorData?.prefix || ''} ${vendorData?.phonenumber || ''}`.trim()}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={vendorData?.store_address || '-'}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Store Information" className="h-100">
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Store Name"
                    value={vendorData?.store_name || '-'}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="Business Registration"
                    value={vendorData?.business_reg_number || '-'}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="GST Number"
                    value={vendorData?.gst_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<Calendar size={16} />}
                    label="Vendor ID"
                    value={vendorData?.vendor_id || '-'}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24}>
                <Card title="All Documents">
                  <Table 
                    columns={documentColumns} 
                    dataSource={vendorData ? [
                      { key: '1', name: 'Business License', status: vendorData?.bussiness_license_number || vendorData?.bussiness_license_number_pic ? 'Uploaded' : 'Pending', url: vendorData?.bussiness_license_number_pic || null },
                      { key: '2', name: 'GST Certificate', status: vendorData?.gst_number_pic ? 'Uploaded' : 'Pending', url: vendorData?.gst_number_pic || null },
                      { key: '3', name: 'Identity Proof', status: vendorData?.identity_proof ? 'Uploaded' : 'Pending', url: vendorData?.identity_proof || null },
                      { key: '4', name: 'Insurance Certificate', status: vendorData?.vendor_insurance_certificate ? 'Uploaded' : 'Pending', url: vendorData?.vendor_insurance_certificate || null },
                      { key: '5', name: 'Health Certificate', status: vendorData?.health_inspection_certificate ? 'Uploaded' : 'Pending', url: vendorData?.health_inspection_certificate || null },
                      { key: '6', name: 'Food Certificate', status: vendorData?.food_certificate ? 'Uploaded' : 'Pending', url: vendorData?.food_certificate || null }
                    ] : []} 
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Bank Details Tab */}
          <TabPane tab={<span><Banknote size={16} /> Bank Details</span>} key="4">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Bank Account Information">
                  <InfoRow 
                    icon={<Banknote size={16} />}
                    label="Account Number"
                    value="****-****-****-1234"
                  />
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Account Holder"
                    value={`${vendorData?.firstname || ''} ${vendorData?.lastname || ''}`.trim()}
                  />
                  <InfoRow 
                    icon={<Banknote size={16} />}
                    label="Bank Name"
                    value="Sample Bank Ltd."
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="IFSC Code"
                    value="SAMP0001234"
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Payment Settings">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Auto Payout</span>
                      <Badge status="success" text="Enabled" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Payout Schedule</span>
                      <span>Weekly</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Next Payout</span>
                      <span>July 25, 2025</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Analytics Tab */}
          <TabPane tab={<span><BarChart2 size={16} /> Analytics</span>} key="3">
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24}>
                <Card>
                  <div className="d-flex alisgn-items-center justify-content-between flex-md-row flex-column">
                    <h4 className="mb-0">Analytics </h4>
                    <div className="d-flex align-items-center " style={{ gap: 12 }}>
                      <DateRangeSelector
                        preset={datePreset}
                        start={tempStart}
                        end={tempEnd}
                        onChange={({ preset, start, end }) => {
                          setDatePreset(preset);
                          setTempStart(start);
                          setTempEnd(end);
                          setSelectedStart(start);
                          setSelectedEnd(end);
                          fetchAnalytics(start, end);
                        }}
                      />
                    </div>
                  </div>
                </Card>
                {/* custom inline picker removed in favor of reusable DateRangeSelector */}
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <StatCard
                  title="Total Earnings"
                  value={Number(effectiveTotals.earnings || 0)}
                  icon={<DollarSign size={20} />}
                  trend={calculateTrend(effectiveTotals.earnings, rangePreviousTotals.earnings).trend}
                  trendValue={calculateTrend(effectiveTotals.earnings, rangePreviousTotals.earnings).percentText}
                  // color="#52c41a"
                  // suffix="$"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="Total Orders"
                  value={Number(effectiveTotals.orders || 0)}
                  icon={<ShoppingCart size={20} />}
                  trend={calculateTrend(effectiveTotals.orders, rangePreviousTotals.orders).trend}
                  trendValue={calculateTrend(effectiveTotals.orders, rangePreviousTotals.orders).percentText}
                  // color="#1890ff"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="Total Customers"
                  value={Number(effectiveTotals.customers || 0)}
                  icon={<TrendingUp size={20} />}
                  trend={calculateTrend(effectiveTotals.customers, rangePreviousTotals.customers).trend}
                  trendValue={calculateTrend(effectiveTotals.customers, rangePreviousTotals.customers).percentText}
                  // color="#722ed1"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card title="Earnings Trend" className="h-100">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={mappedRangeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey={'earnings'} stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Orders & Customers" className="h-100">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={mappedRangeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill={THEME.primary} />
                      <Bar dataKey="customers" fill={THEME.warning} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {rangeLoading && (
              <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                <Spin size="small" />
                <span className="ms-2">Loading...</span>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;