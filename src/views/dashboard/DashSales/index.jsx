// react-bootstrap
import { Row, Col, Card } from 'react-bootstrap';

// project imports
import FlatCard from 'components/Widgets/Statistic/FlatCard';
import ProductCard from 'components/Widgets/Statistic/ProductCard';
import FeedTable from 'components/Widgets/FeedTable';
import { useEffect, useState } from 'react';
import api from '../../../services/axiosInstanse';
import { getAllProducts, getAllBanners, getAllRiders } from '../../../services/apiService';

const extractCount = (res, fallbackArrayPaths = []) => {
  if (!res) return 0;
  const data = res.data ?? res;
  const maybeTotal = data?.total ?? data?.count ?? res?.total ?? res?.count;
  if (typeof maybeTotal === 'number' && !Number.isNaN(maybeTotal)) return maybeTotal;
  if (typeof maybeTotal === 'string' && !Number.isNaN(Number(maybeTotal))) return Number(maybeTotal);
  for (const path of fallbackArrayPaths) {
    const arr = path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), res);
    if (Array.isArray(arr)) return arr.length;
  }
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(res)) return res.length;
  if (Array.isArray(data?.data)) return data.data.length;
  if (Array.isArray(data?.orders)) return data.orders.length;
  if (Array.isArray(data?.products)) return data.products.length;
  return 0;
};

const extractArray = (res, fallbackArrayPaths = []) => {
  if (!res) return [];
  const data = res.data ?? res;
  if (Array.isArray(data)) return data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data?.orders)) return res.data.orders;
  if (Array.isArray(res.orders)) return res.orders;
  for (const path of fallbackArrayPaths) {
    const arr = path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), res);
    if (Array.isArray(arr)) return arr;
  }
  return [];
};

// -----------------------|| DASHBOARD SALES ||-----------------------//
export default function DashSales() {
  const [summary, setSummary] = useState({
    totalVendors: 0,
    activeVendors: 0,
    unverifiedVendors: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    outForDeliveryOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRiders: 0,
    totalBanners: 0,
    recentOrders: [],
    recentVendors: []
  });
  const [feedOptions, setFeedOptions] = useState([]);
  const FEED_WRAP = 'feed-card';
  const FEED_HEIGHT = '487px';

  const countOrderStatuses = (orders = []) => {
    if (!Array.isArray(orders)) return { completed: 0, cancelled: 0, pending: 0, confirmed: 0, outForDelivery: 0 };
    let completed = 0, cancelled = 0, pending = 0, confirmed = 0, outForDelivery = 0;
    for (const o of orders) {
      const s = o?.status ?? o?.order_status ?? o?.orderStatus ?? o?.status_text ?? null;
      if (s == null) { pending += 1; continue; }
      if (typeof s === 'number') {
        if (s === 4) completed += 1;
        if (s === 3 || s === 5) cancelled += 1;
        if (s === 0) pending += 1;
        if (s === 1) confirmed += 1;
        if (s === 2) outForDelivery += 1;
      } else if (typeof s === 'string') {
        const norm = s.trim().toLowerCase();
        if (norm.includes('deliver')) completed += 1;
        if (norm.includes('reject') || norm.includes('cancel')) cancelled += 1;
        if (norm.includes('pending')) pending += 1;
        if (norm.includes('confirm') || norm.includes('prepar')) confirmed += 1;
        if (norm.includes('out for') || norm.includes('out_for') || norm.includes('delivery assigned')) outForDelivery += 1;
      }
    }
    return { completed, cancelled, pending, confirmed, outForDelivery };
  };

  useEffect(() => {
    let mounted = true;
    const loadSummary = async () => {
      try {
        const [vendorsRes, vendorsAllRes, productsRes, categoriesRes, bannersRes, ridersRes, ordersRes, ordersFullRes, unverifiedRes] = await Promise.all([
          api.get('/vendors/getallvendorsforadmin?filter=active'),
          api.get('/vendors/getallvendorsforadmin'),
          getAllProducts(),
          api.post('/category/fetch-categories', { is_web: true, role_id: 1 }),
          getAllBanners(),
          getAllRiders(true),
          api.post('/order/list', { page: 1, limit: 10 }),
          api.post('/order/list', { page: 1, limit: 500 }),
          api.get('/users/unverifiedUsers')
        ]);

        if (!mounted) return;

        const activeVendors = extractCount(vendorsRes, ['data', 'data', 'vendors']);
        const allVendors = extractCount(vendorsAllRes, ['data', 'data', 'vendors']);
        const products = extractCount(productsRes, ['data', 'products', 'data']);
        const categories = extractCount(categoriesRes, ['data.categories', 'data']);
        const banners = extractCount(bannersRes, ['data.banners', 'data']);
        const riders = extractCount(ridersRes, ['data.data', 'data']);
        const orders = extractCount(ordersRes, ['data.orders', 'data.data', 'orders']);
        const fullOrdersArr = extractArray(ordersFullRes, ['data.data', 'data.orders', 'orders']);
        const unverified = extractCount(unverifiedRes, ['data.vendors', 'data']);

        const { completed, cancelled, pending, confirmed, outForDelivery } = countOrderStatuses(fullOrdersArr);

        const recentOrdersArr = extractArray(ordersRes, ['data.data', 'data.orders', 'orders']);
        const recentVendorsArr = extractArray(vendorsAllRes, ['data.data', 'vendors', 'data']);

        // build feed options from full orders, newest-first
        const ordersSorted = Array.isArray(fullOrdersArr)
          ? fullOrdersArr.slice().sort((a, b) => new Date(b?.created_at || b?.order_created_at || 0) - new Date(a?.created_at || a?.order_created_at || 0))
          : [];

        const timeAgo = (ts) => {
          if (!ts) return '';
          const d = new Date(ts);
          const diff = Date.now() - d.getTime();
          if (diff < 60_000) return 'Just Now';
          const mins = Math.floor(diff / 60_000);
          if (mins < 60) return `${mins} min ago`;
          const hours = Math.floor(mins / 60);
          if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
          return d.toLocaleString();
        };

        const feeds = ordersSorted.map((o) => {
          const name = (o?.user?.firstname) || o?.firstname || o?.name || 'Guest';
          const id = o?.order_uid || o?.order_id || '';
          const when = timeAgo(o?.created_at || o?.order_created_at);
          return {
            icon: 'shopping-cart',
            bgclass: 'light-primary',
            heading: `Order ${id} received from ${name}`,
            publishon: when,
            link: null,
          };
        });

        setFeedOptions(feeds);

        setSummary((prev) => ({
          ...prev,
          totalVendors: allVendors,
          activeVendors,
          unverifiedVendors: unverified,
          totalProducts: products,
          totalCategories: categories,
          totalRiders: riders,
          totalBanners: banners,
          totalOrders: orders,
          completedOrders: completed,
          cancelledOrders: cancelled,
          pendingOrders: pending,
          confirmedOrders: confirmed,
          outForDeliveryOrders: outForDelivery,
          recentOrders: recentOrdersArr.slice(0, 5),
          recentVendors: recentVendorsArr.slice(0, 5)
        }));
      } catch (err) {
        console.warn('Dashboard summary load failed', err?.message || err);
      }
    };
    loadSummary();
    return () => { mounted = false; };
  }, []);

  const statusCards = [
    { label: 'Completed',        value: summary.completedOrders,      icon: 'check_circle',    color: '#28a745' },
    { label: 'Cancelled',        value: summary.cancelledOrders,      icon: 'cancel',          color: '#dc3545' },
    { label: 'Pending',          value: summary.pendingOrders,        icon: 'hourglass_empty', color: '#ffc107' },
    { label: 'Confirmed',        value: summary.confirmedOrders,      icon: 'verified',        color: '#17a2b8' },
    { label: 'Out For Delivery', value: summary.outForDeliveryOrders, icon: 'delivery_dining', color: '#fd7e14' },
  ];

  return (
    <Row className="pt-3 ms-0 me-0">

      {/* ── ROW 1: Products / Categories / Riders ── */}
      <Col md={12} xl={6}>
        <Card className="flat-card">
          <div className="row-table">
            <Card.Body className="col-sm-6 br">
              <FlatCard params={{ title: 'Products', iconClass: 'text-primary mb-1', icon: 'local_offer', value: summary.totalProducts ?? '—' }} />
            </Card.Body>
            <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
              <FlatCard params={{ title: 'Categories', iconClass: 'text-primary mb-1', icon: 'category', value: summary.totalCategories ?? '—' }} />
            </Card.Body>
            <Card.Body className="col-sm-6 card-body">
              <FlatCard params={{ title: 'Riders', iconClass: 'text-primary mb-1', icon: 'two_wheeler', value: summary.totalRiders ?? '—' }} />
            </Card.Body>
          </div>
        </Card>
      </Col>

      {/* ── ROW 1 right: Total Orders + Products ProductCards ── */}
      <Col md={12} xl={6}>
        <Row>
          <Col sm={6}>
            <ProductCard params={{ title: 'Total Orders', primaryText: String(summary.totalOrders ?? '—'), icon: 'local_mall' }} />
          </Col>
          <Col sm={6}>
            <ProductCard params={{ title: 'Products', primaryText: String(summary.totalProducts ?? '—'), icon: 'local_offer' }} />
          </Col>
        </Row>
      </Col>

      {/* ── ROW 2: 5 Status Cards — Full Width ── */}
      <Col md={12} className="mt-3">
        <Row className="gx-3">
          {statusCards.map(({ label, value, icon, color }) => (
            <Col key={label}>
              <Card className="flat-card">
                <Card.Body className="p-3 text-center">
                  <span className="material-icons" style={{ color, fontSize: 28 }}>{icon}</span>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{value ?? '—'}</div>
                  <div style={{ fontSize: 12, color: '#6c757d', marginTop: 3 }}>{label}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* ── ROW 3: Feeds Table — Full Width ── */}
      <Col md={12} className="mt-3">
        <FeedTable
          wrapclass={FEED_WRAP}
          title={'Orders'}
          height={FEED_HEIGHT}
          options={
            feedOptions.length
              ? feedOptions
              : [
                  {
                    icon: 'bell',
                    heading: 'No orders yet',
                    publishon: ''
                  }
                ]
          }
        />
      </Col>

    </Row>
  );
}