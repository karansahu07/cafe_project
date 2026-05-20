import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Badge, Button, Statistic, Table, Progress, DatePicker, message, Spin, Image, Select, Typography, Avatar, Divider, Space, Tag } from 'antd';
import DateRangeSelector from '../../../components/DateRangeSelector';
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
import { getRiderAnalytics, getRiderById } from '../../../services/apiService';
import api from '../../../services/axiosInstanse';
import { UserOutlined } from '@ant-design/icons';

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
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    padding: '20px',
    minHeight: 120,
    display: 'flex',
    alignItems: 'center'
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
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    marginRight: '18px'
  }
};

const RiderDashboard = () => {
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
  const [pointsEarned, setPointsEarned] = useState(0);
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [completedDeliveriesCount, setCompletedDeliveriesCount] = useState(0);
  const [datePreset, setDatePreset] = useState('today');

  const params = useParams();
  const routeRiderId = params?.riderId || params?.id || window.location.pathname.split('/').pop();
  const riderIdNumber = Number(routeRiderId);

  // Rider data (fetched dynamically)
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRider = async () => {
      if (!riderIdNumber) return;
      setLoading(true);
      try {
        const res = await getRiderById(riderIdNumber);
        // normalize different response shapes from API
        const normalized = res?.data ?? res?.rider ?? res ?? null;
        if (normalized && Object.keys(normalized).length > 0) {
          setRiderData(normalized);
        } else {
          message.error(res?.message || 'Failed to fetch rider');
        }
      } catch (error) {
        message.error('Error fetching rider data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadRider();
  }, [riderIdNumber]);
  // Load overview when rider data (including custom_id) is available
  useEffect(() => {
    if (riderData?.custom_id) {
      fetchOverview();
    }
  }, [riderData?.custom_id]);

  // derive points from riderData when available
  useEffect(() => {
    if (riderData) {
      setPointsEarned(Number(riderData?.points_earned || riderData?.total_points || riderData?.points || 0));
      setPointsRedeemed(Number(riderData?.points_redeemed || riderData?.redeemed_points || 0));
    }
  }, [riderData]);

  // Fetch completed deliveries count (order_status === 4) for this rider by matching rider.custom_id
  useEffect(() => {
    let ignore = false;
    const fetchCompleted = async () => {
      if (!riderData?.custom_id) return;
      try {
        const resp = await api.post('/order/list', { page: 1, limit: 1000 });
        const raw = resp?.data || resp || {};
        const allOrders = Array.isArray(raw) ? raw : (Array.isArray(raw?.orders) ? raw.orders : []);
        const matched = allOrders.filter((o) => {
          const rCust = o?.rider?.custom_id || o?.rider_custom_id || o?.rider?.rider_id || null;
          return rCust && String(rCust) === String(riderData.custom_id) && Number(o?.order_status) === 4;
        });
        if (!ignore) setCompletedDeliveriesCount(matched.length || 0);
      } catch (err) {
        console.error('Failed to fetch completed deliveries for rider by custom_id:', err);
        if (!ignore) setCompletedDeliveriesCount(0);
      }
    };
    fetchCompleted();
    return () => { ignore = true; };
  }, [riderData?.custom_id]);

  // Load analytics data when date range changes
  useEffect(() => {
    if (selectedStart && selectedEnd) {
      fetchAnalytics();
    }
  }, [selectedStart, selectedEnd, riderIdNumber]);

  const fetchAnalytics = async (start, end) => {
    if (!start && !end) {
      start = selectedStart;
      end = selectedEnd;
    }
    if (!start || !end) return;
    setRangeLoading(true);
    const res = await getRiderAnalytics(
      riderIdNumber,
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

      console.log('Analytics API Response:', res);
      console.log('Totals:', totalsObj);
      console.log('Previous Totals:', previousTotalsObj);
      console.log('Data Array:', dataArray);

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
      console.error('Failed to load analytics:', res);
      message.error(res.error?.message || 'Failed to load analytics');
      setRangeData([]);
      setRangeTotals({ earnings: 0, orders: 0, customers: 0 });
      setRangePreviousTotals({ earnings: 0, orders: 0, customers: 0 });
    }
    setRangeLoading(false);
  };

  const fetchOverview = async () => {
    setOverviewLoading(true);
    try {
      // Fetch all orders and compute totals for this rider by matching rider.custom_id
      const resp = await api.post('/order/list', { page: 1, limit: 1000 });
      const raw = resp?.data || resp || {};
      const allOrders = Array.isArray(raw) ? raw : (Array.isArray(raw?.orders) ? raw.orders : []);

      const riderCustomId = riderData?.custom_id || riderData?.custom_id || riderData?.rider_id || null;
      const matched = allOrders.filter((o) => {
        const rCust = o?.rider?.custom_id || o?.rider_custom_id || o?.rider?.rider_id || null;
        return rCust && riderCustomId && String(rCust) === String(riderCustomId) && Number(o?.order_status) === 4;
      });

      const earningsSum = matched.reduce((s, o) => s + Number(o?.total_price ?? o?.price ?? 0), 0);
      const ordersCount = matched.length;
      const customersCount = new Set(matched.map((o) => o?.user_id || o?.user?.id || o?.user?.user_id)).size;

      setOverviewData(matched);
      setOverviewTotals({ earnings: Number(earningsSum || 0), orders: Number(ordersCount || 0), customers: Number(customersCount || 0) });
      setOverviewPreviousTotals({ earnings: 0, orders: 0, customers: 0 });
    } catch (err) {
      console.error('Failed to load overview data via order list:', err);
      message.error('Failed to load overview data');
      setOverviewData([]);
      setOverviewTotals({ earnings: 0, orders: 0, customers: 0 });
      setOverviewPreviousTotals({ earnings: 0, orders: 0, customers: 0 });
    } finally {
      setOverviewLoading(false);
    }
  };

  // Data processing functions
  const mappedOverviewData = overviewData.map(item => ({
    date: dayjs(item.order_date).format('MMM DD'),
    earnings: Number(item.total_earning || 0),
    orders: Number(item.total_orders || 0),
    customers: Number(item.total_customers || 0)
  }));

  // Handle different data formats (hourly vs daily)
  const isSameDay = selectedStart && selectedEnd && selectedStart.isSame(selectedEnd, 'day');
  const mappedRangeData = (isSameDay ? rangeData.map((d) => ({
    date: `${d.order_hour}:00`,
    label: `${d.order_hour}:00`,
    earnings: Number(d.total_earning || 0),
    orders: Number(d.total_orders || 0),
    customers: Number(d.total_customers || 0),
  })) : rangeData.map((d) => ({
    date: dayjs(d.order_date).format('MMM DD'),
    label: dayjs(d.order_date).format('MMM DD'),
    earnings: Number(d.total_earning || 0),
    orders: Number(d.total_orders || 0),
    customers: Number(d.total_customers || 0),
  })));

  // Formatting functions
  const formatCurrency = (value) => {
    // Show rupee icon and Indian formatting
    return `[20B₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  // Summary calculations
  const rangeSummary = {
    totalEarnings: mappedRangeData.reduce((sum, item) => sum + item.earnings, 0),
    totalOrders: mappedRangeData.reduce((sum, item) => sum + item.orders, 0),
    totalCustomers: mappedRangeData.reduce((sum, item) => sum + item.customers, 0)
  };

  // Prefer API totals; if they are zero but we have chart data, fallback to computed summary
  const hasApiTotals = (rangeTotals.earnings || rangeTotals.orders || rangeTotals.customers);
  const effectiveTotals = hasApiTotals ? rangeTotals : {
    earnings: Number(rangeSummary.totalEarnings || 0),
    orders: Number(rangeSummary.totalOrders || 0),
    customers: Number(rangeSummary.totalCustomers || 0),
  };
  
  // Use the same fallback logic for analyticsTotals as in SingleVendor.jsx
  const analyticsTotals = hasApiTotals ? rangeTotals : {
    earnings: Number(rangeSummary.totalEarnings || 0),
    orders: Number(rangeSummary.totalOrders || 0),
    customers: Number(rangeSummary.totalCustomers || 0),
  };

  // const calculateTrend = (current, previous) => {
  //   if (previous === 0) return { text: 'No previous data', color: THEME.textSecondary };
  //   const change = ((current - previous) / previous) * 100;
  //   const isPositive = change >= 0;
  //   return {
  //     text: `${isPositive ? '+' : ''}${change.toFixed(1)}% vs previous`,
  //     color: isPositive ? THEME.success : THEME.danger
  //   };
  // };

  // Enhanced trend calculation function similar to SingleVendor.jsx
  const calculateTrend = (current = 0, previous = 0) => {
    const safeCurrent = Number(current || 0);
    const safePrevious = Number(previous || 0);
    
    // Case 1: If previous is 0 and current is positive, show 100% up
    if (safePrevious === 0 && safeCurrent > 0) {
      return { trend: 'up', percentText: '100.0%' };
    }
    
    // Case 2: If current is 0 and previous is positive, show 100% down
    if (safeCurrent === 0 && safePrevious > 0) {
      return { trend: 'down', percentText: '100.0%' };
    }
    
    // Case 3: If both are 0, show neutral
    if (safePrevious === 0 && safeCurrent === 0) {
      return { trend: 'neutral', percentText: '0.0%' };
    }
    
    // Normal case: Calculate percentage change
    const change = ((safeCurrent - safePrevious) / safePrevious) * 100;
    const isPositive = change >= 0;
    return {
      trend: isPositive ? 'up' : 'down',
      percentText: `${Math.abs(change).toFixed(1)}%`
    };
  };
  
  // Alias for backward compatibility
  const calculateTrendData = calculateTrend;

  const rider_id = riderData?.id || routeRiderId;

  const getCurrentData = () => mappedRangeData;

  const getTotalEarnings = () => {
    return getCurrentData().reduce((sum, item) => sum + item.earnings, 0);
  };

  const getTotalOrders = () => {
    return getCurrentData().reduce((sum, item) => sum + item.orders, 0);
  };

  const getTotalCustomers = () => {
    return getCurrentData().reduce((sum, item) => sum + item.customers, 0);
  };

  const getAverageRating = () => {
    const data = getCurrentData();
    const totalRating = data.reduce((sum, item) => sum + (item.rating || 4.8), 0);
    return (totalRating / data.length).toFixed(1);
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, color = THEME.primary, suffix = "", isCurrency = true }) => {
    return (
      <Card style={styles.statCard}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: `${color}15`, flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>{title}</Text>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>
                  {isCurrency && typeof value === 'number' ? (
                    <span style={{fontFamily:'inherit'}}>&#8377;{Number(value || 0).toLocaleString('en-IN')}</span>
                  ) : (
                    <span>{value}</span>
                  )}{suffix}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

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

  // Sample category data for charts
  const categoryData = [
    { name: 'Food Delivery', value: 45, color: '#1890ff' },
    { name: 'Grocery', value: 30, color: '#52c41a' },
    { name: 'Pharmacy', value: 15, color: '#faad14' },
    { name: 'Other', value: 10, color: '#f5222d' }
  ];

  return (
    <div className='p2' style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <Card bodyStyle={{padding:6}} style={{ borderRadius: '0', padding:6}}>
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
                {riderData?.profile_pic ? (
                  <img src={riderData.profile_pic} alt="Profile" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} />
                ) : (
                  <span>{riderData?.firstname?.[0]?.toUpperCase() || 'R'}</span>
                )}
              </div>
              <div>
                <h3 className="mb-1">{`${riderData?.firstname || ''} ${riderData?.lastname || ''}`.trim() || 'Loading...'}</h3>
                <p className="text-muted mb-0">ID: {riderData?.custom_id || '-'}</p>
              </div>
            </div>
          </Col>
          <Col>
            <Badge 
              status={riderData?.is_verified === 1 ? 'success' : 'warning'}
              text={riderData?.is_verified === 1 ? 'Verified Rider' : 'Pending Verification'}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <div className="">
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarStyle={{backgroundColor:"white",paddingLeft:10}} size="large">
          {/* Overview Tab */}
          <TabPane tab={<span><Eye size={16} /> Overview</span>} key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Points Earn"
                  value={String(pointsEarned || 0)}
                  icon={<Award size={16} />}
                  color={THEME.primary}
                  isCurrency={false}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Redeemed Points"
                  value={String(pointsRedeemed || 0)}
                  icon={<Award size={16} />}
                  color={THEME.primary}
                  isCurrency={false}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Deliveries"
                  value={completedDeliveriesCount}
                  icon={<ShoppingCart size={16} />}
                  color={THEME.primary}
                  isCurrency={false}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Customer Rating"
                  value={getAverageRating() || 4.8}
                  icon={<Star size={16} />}
                  trend="neutral"
                  trendValue="Stable"
                  color={THEME.warning}
                  isCurrency={false}
                />
              </Col>
            </Row>

            {/* Charts removed per request: Weekly Earnings Trend and Delivery Categories
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card title="Weekly Earnings Trend" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mappedOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="earnings" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Delivery Categories" className="h-100">
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
            */}
          </TabPane>

          {/* Rider Details Tab */}
          <TabPane tab={<span><User size={16} /> Rider Details</span>} key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Personal Information" className="h-100">
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Full Name"
                    value={`${riderData?.firstname || ''} ${riderData?.lastname || ''}`.trim() || '-'}
                  />
                  <InfoRow 
                    icon={<Mail size={16} />}
                    label="Email Address"
                    value={riderData?.email || '-'}
                  />
                  <InfoRow 
                    icon={<Phone size={16} />}
                    label="Phone Number"
                    value={`${riderData?.prefix || ''} ${riderData?.phonenumber || ''}`.trim() || '-'}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={`${riderData?.rider_lat || ''}, ${riderData?.rider_lng || ''}`.trim() || '-'}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Rider Information" className="h-100">
                  <InfoRow 
                    icon={<Truck size={16} />}
                    label="Vehicle Registration"
                    value={riderData?.vehicle_registration_number || '-'}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="License Number"
                    value={riderData?.license_number || '-'}
                  />
                  <InfoRow 
                    icon={<Calendar size={16} />}
                    label="Username"
                    value={riderData?.username || '-'}
                  />
                  <InfoRow 
                    icon={<Award size={16} />}
                    label="Rider ID"
                    value={riderData?.rider_id || '-'}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24}>
                <Card title="Documents">
                  <Table 
                    columns={[
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
                    ]} 
                    dataSource={[
                      { key: '1', name: 'Identity Proof', status: riderData?.identity_proof ? 'Uploaded' : 'Pending', url: riderData?.identity_proof || null },
                      { key: '2', name: 'Profile Picture', status: riderData?.profile_pic ? 'Uploaded' : 'Pending', url: riderData?.profile_pic || null }
                    ]} 
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
                    value={`${riderData?.firstname || ''} ${riderData?.lastname || ''}`.trim() || '-'}
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

          {/* Analytics Tab removed per request */}
        </Tabs>
      </div>
    </div>
  );
};

export default RiderDashboard;