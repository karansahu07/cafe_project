import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useNotificationStore from '../../store/useNotificationStore';
import socket from '../../services/socket';
import { getHomeRouteFromRoleId } from '../../utils/authSession';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zcafe.ekarigar.com';

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const toDateForTodayTime = (timeValue) => {
  if (!timeValue) return null;

  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(String(timeValue))) {
    const now = new Date();
    const parts = String(timeValue).split(':').map((p) => safeNumber(p));
    const [hours, minutes, seconds] = [parts[0] || 0, parts[1] || 0, parts[2] || 0];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
  }

  const parsed = new Date(`${new Date().toDateString()} ${timeValue}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isTodayByLocalDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const extractOrdersArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const extractRidersArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.riders)) return payload.riders;
  if (Array.isArray(payload?.vendors)) return payload.vendors;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const extractProductsFromResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) {
    // could be array of categories (with .products) or flat products
    if (res.length > 0 && res[0] && Array.isArray(res[0].products)) {
      return res.flatMap((c) => Array.isArray(c.products) ? c.products : []);
    }
    return res;
  }
  if (Array.isArray(res.data)) {
    if (res.data.length > 0 && res.data[0] && Array.isArray(res.data[0].products)) {
      return res.data.flatMap((c) => Array.isArray(c.products) ? c.products : []);
    }
    return res.data;
  }
  if (Array.isArray(res.categories)) return res.categories.flatMap((c) => Array.isArray(c.products) ? c.products : []);
  if (Array.isArray(res.products)) return res.products;
  return [];
};

const getStatusMeta = (status) => {
  if (status == null) return { text: 'Pending', className: 'warning' };
  const value = safeNumber(status, -1);
  if (value === 0) return { text: 'Pending', className: 'warning' };
  if (value === 1) return { text: 'Confirmed', className: 'info' };
  if (value === 2) return { text: 'Out for delivery', className: 'primary' };
  if (value === 3) return { text: 'Cancelled', className: 'warning' };
  if (value === 4) return { text: 'Order Delivered', className: 'success' };
  return { text: 'Unknown', className: 'secondary' };
};

const mapOrder = (rawOrder) => {
  const user = rawOrder?.user || {};
  const addressObj = rawOrder?.address || {};
  const itemsSource = rawOrder?.items || rawOrder?.order_items || rawOrder?.products || [];
  const fullname = [
    user?.firstname || rawOrder?.firstname,
    user?.lastname || rawOrder?.lastname
  ].filter(Boolean).join(' ').trim();
  const firstnameOnly =
    user?.firstname ||
    rawOrder?.firstname ||
    (typeof user?.name === 'string' && user.name.split(' ')[0]) ||
    (typeof rawOrder?.name === 'string' && rawOrder.name.split(' ')[0]) ||
    '';
  const addressLine = [
    addressObj?.address || rawOrder?.address,
    addressObj?.floor || rawOrder?.floor,
    addressObj?.landmark || rawOrder?.landmark
  ].filter(Boolean).join(', ');

  return {
    order_id: rawOrder?.order_id || rawOrder?.id || '',
    order_uid: rawOrder?.order_uid || rawOrder?.uid || '',
    // Prefer first name only on the home orders list (avoid showing only last name)
    name: (firstnameOnly || fullname) || rawOrder?.name || 'Guest',
    order_status: rawOrder?.order_status ?? null,
    is_fast_delivery: rawOrder?.is_fast_delivery,
    phone: user?.phonenumber || rawOrder?.phonenumber || rawOrder?.phone || '-',
    rider_unique_id: rawOrder?.rider_unique_id || rawOrder?.rider?.custom_id || '-',
    payment_method: rawOrder?.payment_method || '-',
    order_created_at: rawOrder?.created_at || rawOrder?.order_created_at,
    price: rawOrder?.total_price ?? rawOrder?.price ?? 0,
    delivery_charge: rawOrder?.delivery_charge ?? rawOrder?.delivery_charges ?? 0,
    address: addressLine || rawOrder?.address || '-',
    items: Array.isArray(itemsSource)
      ? itemsSource.map((item) => ({
          name: item?.product_name || item?.name || '-',
          quantity: item?.product_quantity ?? item?.quantity ?? 0,
          product_price: item?.total_item_price ?? item?.product_price ?? item?.price ?? 0,
          food_type: item?.food_type,
          variant_value: item?.variant_value,
          variant_type: item?.variant_type,
          variant_price: item?.variant_price,
          addons: item?.addons || []
        }))
      : []
  };
};

export default function StoreHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, addNotification } = useNotificationStore();
  const lastSyncedNotificationRef = useRef('');

  const [ready, setReady] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeProfile, setStoreProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('new');
  const [searchTerm, setSearchTerm] = useState('');
  const [storeOnline, setStoreOnline] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [acceptChoiceOpen, setAcceptChoiceOpen] = useState(false);
  const [assignRiderOpen, setAssignRiderOpen] = useState(false);
  const [assignRidersLoading, setAssignRidersLoading] = useState(false);
  const [assignRidersError, setAssignRidersError] = useState('');
  const [availableRiders, setAvailableRiders] = useState([]);
  const [assignmentOrder, setAssignmentOrder] = useState(null);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryUserId = params.get('user_id');
    const queryToken = params.get('token');

    if (queryUserId) {
      localStorage.setItem('user_id', queryUserId);
    }
    if (queryToken) {
      localStorage.setItem('token', queryToken);
      localStorage.setItem('vendor_ini_token', queryToken);
      localStorage.setItem('user_token', queryToken);
    }

    if (queryUserId || queryToken) {
      navigate(location.pathname, { replace: true });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    if (safeNumber(decodedToken?.is_verified, 1) === 0) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    const roleId = safeNumber(decodedToken?.role_id, safeNumber(localStorage.getItem('role_id')));
    if (roleId && roleId !== 3) {
      navigate(getHomeRouteFromRoleId(roleId), { replace: true });
      return;
    }

    const resolvedVendorId =
      queryUserId ||
      localStorage.getItem('user_id') ||
      decodedToken?.vendor_id ||
      decodedToken?.user_id ||
      decodedToken?.id ||
      '';

    if (resolvedVendorId) {
      localStorage.setItem('user_id', String(resolvedVendorId));
    }
    if (decodedToken?.role_id) {
      localStorage.setItem('role_id', String(decodedToken.role_id));
    }

    setAuthToken(token);
    setVendorId(String(resolvedVendorId || ''));
    setReady(true);
  }, [location.pathname, location.search, navigate]);

  const callApi = useCallback(
    async (endpoint, payload = {}, method = 'POST') => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: method === 'GET' ? undefined : JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      return data;
    },
    [authToken]
  );

  const evaluateStoreStatus = useCallback((profile) => {
    const backendStatus = safeNumber(profile?.status ?? profile?.vendor_status);
    const start = toDateForTodayTime(profile?.vendor_start_time || profile?.start_time);
    const close = toDateForTodayTime(profile?.vendor_close_time || profile?.close_time);

    const now = new Date();
    const inTimeWindow = start && close ? now >= start && now <= close : true;
    const isOpen = backendStatus === 1 && inTimeWindow;

    setStoreOnline(isOpen);
  }, []);

  const loadHomeData = useCallback(async () => {
    // If called with silent=true, don't toggle the top-level loading spinner
    const loadHomeDataImpl = async (silent = false) => {
      if (!vendorId || !authToken) return;

      if (!silent) {
        setLoading(true);
        setError('');
      }

      try {
        const profileRes = await callApi('/vendors/vendor-profile', {
        user_id: vendorId,
        role_id: 3
      });

      const profileData = profileRes?.data || profileRes?.vendor || profileRes?.profile || profileRes;
      const normalizedProfile = {
        ...(profileData || {}),
        address:
          profileData?.address ||
          profileData?.store_address ||
          profileData?.vendor_address ||
          ''
      };
      setStoreProfile(normalizedProfile);
      evaluateStoreStatus(normalizedProfile);

      let rawOrders = [];
      try {
        const ordersRes = await callApi('/order/list', {
          page: 1,
          limit: 500,
          vendor_id: String(vendorId)
        });
        rawOrders = extractOrdersArray(ordersRes);
      } catch {
        const fallbackOrdersRes = await callApi('/order/getallorderbyvendorid/today', {
          user_id: vendorId,
          role_id: 3
        });
        rawOrders = extractOrdersArray(fallbackOrdersRes);
      }

      const mappedOrders = (Array.isArray(rawOrders) ? rawOrders : []).map(mapOrder);
      setOrders(mappedOrders);

      const productsRes = await callApi('/products/getallproductsbyvendorID', {
        vendor_id: vendorId
      });
      const rawProducts = extractProductsFromResponse(productsRes);
      setProducts(Array.isArray(rawProducts) ? rawProducts : []);

      } catch (err) {
        if (!silent) setError(err?.message || 'Home data load failed');
      } finally {
        if (!silent) setLoading(false);
      }
    };

    // Default call
    return loadHomeDataImpl();
  }, [authToken, callApi, evaluateStoreStatus, vendorId]);

  // Helper to call loadHomeData silently (no spinner)
  const loadHomeDataSilent = useCallback(async () => {
    if (!vendorId || !authToken) return;
    // reuse implementation but avoid top-level spinner
    const response = await (async () => {
      try {
        // reuse existing call flow by invoking loadHomeData with silent flag
        // Since loadHomeData returns a promise from inner impl only when called directly,
        // we replicate minimal logic: call api endpoints similarly but in silent mode by calling the outer function's inner impl would require refactor.
        // Simpler: call main loader and rely on it to avoid spinner when silent isn't passed; so instead call loadHomeData() and it will show spinner.
        // To keep changes small, call loadHomeData() but without toggling loading — we will instead call the same API used in loadHomeData directly here.
        const profileRes = await callApi('/vendors/vendor-profile', { user_id: vendorId, role_id: 3 });
        const profileData = profileRes?.data || profileRes?.vendor || profileRes?.profile || profileRes;
        const normalizedProfile = { ...(profileData || {}), address: profileData?.address || profileData?.store_address || profileData?.vendor_address || '' };
        setStoreProfile(normalizedProfile);
        evaluateStoreStatus(normalizedProfile);

        let rawOrders = [];
        try {
          const ordersRes = await callApi('/order/list', { page: 1, limit: 500, vendor_id: String(vendorId) });
          rawOrders = extractOrdersArray(ordersRes);
        } catch {
          const fallbackOrdersRes = await callApi('/order/getallorderbyvendorid/today', { user_id: vendorId, role_id: 3 });
          rawOrders = extractOrdersArray(fallbackOrdersRes);
        }

        const mappedOrders = (Array.isArray(rawOrders) ? rawOrders : []).map(mapOrder);
        setOrders(mappedOrders);

        const productsRes = await callApi('/products/getallproductsbyvendorID', { vendor_id: vendorId });
        const rawProducts = extractProductsFromResponse(productsRes);
        setProducts(Array.isArray(rawProducts) ? rawProducts : []);
      } catch (err) {
        // silent failures ignored
      }
    })();
    return response;
  }, [authToken, callApi, evaluateStoreStatus, vendorId]);

  useEffect(() => {
    if (!ready) return;
    loadHomeData();
  }, [ready, loadHomeData]);

  useEffect(() => {
    if (!ready || !vendorId) return;

    const numericVendorId = Number(vendorId);
    const joinPayload = {
      role: 'vendor',
      id: Number.isNaN(numericVendorId) ? vendorId : numericVendorId,
      vendor_id: Number.isNaN(numericVendorId) ? vendorId : numericVendorId
    };

    const joinVendorRoom = () => {
      console.log('[Home] Socket joined status:', socket.connected);
      console.log('[Home] Emitting join event with payload:', joinPayload);
      socket.emit('join', joinPayload);
      console.log('[Home] ✅ Join event emitted');
    };

    // Join immediately and re-join after reconnect so room subscription is never lost.
    joinVendorRoom();
    socket.on('connect', joinVendorRoom);
    const handleNewOrder = (payload) => {
      console.log('[Home] 📥 New order event received:', payload);
      const orderId = payload?.order_id || payload?.orderId || payload?.id || '';
      const orderUid = payload?.order_uid || payload?.orderUid || '';

      addNotification({
        id: String(orderId || orderUid || Date.now()),
        type: 'order',
        title: payload?.title || 'New Order Received',
        body: payload?.message || payload?.body || 'A new customer order was placed.',
        order_id: orderId,
        order_uid: orderUid,
        createdAt: new Date().toISOString()
      });
      // Refresh silently to avoid blinking spinner/UI flash
      loadHomeDataSilent();
      console.log('[Home] ✅ Notification added and home data reloaded (silent)');
    };

    socket.on('new_order', handleNewOrder);
    socket.on('vendor_new_order', handleNewOrder);

    return () => {
      socket.off('connect', joinVendorRoom);
      socket.off('new_order', handleNewOrder);
      socket.off('vendor_new_order', handleNewOrder);
    };
  }, [addNotification, loadHomeData, loadHomeDataSilent, ready, vendorId]);
  // NOTE: loadHomeDataSilent used inside effect as well; include in deps to satisfy hooks

  useEffect(() => {
    if (!ready) return;
    if (!Array.isArray(notifications) || notifications.length === 0) return;

    const latest = notifications[0];
    if (!latest?.id) return;
    if (lastSyncedNotificationRef.current === latest.id) return;

    const isOrderSignal = latest?.type === 'order' || latest?.order_id || latest?.order_uid;
    if (!isOrderSignal) return;

    lastSyncedNotificationRef.current = latest.id;
    loadHomeData();
  }, [loadHomeData, notifications, ready]);

  // Sort orders by newest first (latest created_at)
  const todayOrders = useMemo(() => {
    return orders
      .filter((order) => isTodayByLocalDate(order?.order_created_at))
      .sort((a, b) => new Date(b.order_created_at || 0) - new Date(a.order_created_at || 0));
  }, [orders]);

  // Active orders: status 0,1,2,3 (not delivered)
  const filteredPrepareOrders = useMemo(() => {
    return todayOrders.filter((order) => safeNumber(order.order_status) !== 4);
  }, [todayOrders]);

  // Completed orders: status 4 only
  const filteredOrderReadyOrders = useMemo(() => {
    return todayOrders.filter((order) => safeNumber(order.order_status) === 4);
  }, [todayOrders]);

  const filteredReceiveOrders = useMemo(() => {
    return todayOrders.filter((order) => safeNumber(order.order_status) === 0);
  }, [todayOrders]);

  // Correct totals for tracking details (based on TODAY's orders only)
  const totalOrdersCount = useMemo(() => (Array.isArray(todayOrders) ? todayOrders.length : 0), [todayOrders]);
  const completedOrdersCount = useMemo(() => (Array.isArray(todayOrders) ? todayOrders.filter((o) => safeNumber(o.order_status) === 4).length : 0), [todayOrders]);
  const cancelledOrdersCount = useMemo(() => (Array.isArray(todayOrders) ? todayOrders.filter((o) => safeNumber(o.order_status) === 3).length : 0), [todayOrders]);
  const productsCount = useMemo(() => (Array.isArray(products) ? products.length : 0), [products]);

  const activeOrders = useMemo(() => {
    return activeTab === 'new' ? filteredPrepareOrders : filteredOrderReadyOrders;
  }, [activeTab, filteredOrderReadyOrders, filteredPrepareOrders]);

  const searchedOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return activeOrders;

    return activeOrders.filter((order) => {
      const itemNames = (order.items || []).map((item) => item.name).join(' ');
      const haystack = [order.name, order.address, order.order_id, order.order_uid, String(order.price), itemNames]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeOrders, searchTerm]);

  const updateOrderStatus = useCallback(
    async (orderId, nextStatus) => {
      await callApi('/order/updateorderstatus', {
        order_id: orderId,
        vendor_id: vendorId,
        order_status: nextStatus
      }, 'PUT');
    },
    [callApi, vendorId]
  );

  // Optimistically update local orders list to avoid waiting for full reload
  const updateLocalOrderStatus = useCallback((orderId, nextStatus) => {
    setOrders((prev) => prev.map((o) => (String(o.order_id) === String(orderId) ? { ...o, order_status: nextStatus } : o)));
  }, []);

  const handleAccept = async (order) => {
    setAssignmentOrder(order);
    setAcceptChoiceOpen(true);
  };

  const fetchActiveRiders = useCallback(async () => {
    setAssignRidersLoading(true);
    setAssignRidersError('');

    try {
      const ridersRes = await callApi('/riders/getallridersforadmin?filter=active', {}, 'GET');
      const ridersList = extractRidersArray(ridersRes).map((rider) => ({
        rider_id: rider?.rider_id || rider?.id || rider?.user_id || '',
        custom_id: rider?.custom_id || rider?.rider_code || rider?.rider_id || '-',
        store_name: rider?.store_name || rider?.name || rider?.firstname || rider?.fullname || 'Rider',
        phone: rider?.phonenumber || rider?.phone || '-',
        status: rider?.status ?? rider?.rider_status ?? null,
        raw: rider,
      })).filter((rider) => rider.rider_id);

      setAvailableRiders(ridersList);
    } catch (err) {
      setAssignRidersError(err?.message || 'Unable to load riders');
      setAvailableRiders([]);
    } finally {
      setAssignRidersLoading(false);
    }
  }, [callApi]);

  const handleSendToAllRiders = async () => {
    if (!assignmentOrder) return;
    setActionLoading(true);
    try {
      await updateOrderStatus(assignmentOrder.order_id, 1);
      // optimistic local update and silent refresh
      updateLocalOrderStatus(assignmentOrder.order_id, 1);
      await loadHomeDataSilent();
      setAcceptChoiceOpen(false);
      setAssignmentOrder(null);
    } catch (err) {
      setError(err?.message || 'Unable to send order to all riders');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenManualAssign = async () => {
    if (!assignmentOrder) return;
    setAcceptChoiceOpen(false);
    setAssignRiderOpen(true);
    await fetchActiveRiders();
  };

  const handleAssignRider = async (rider) => {
    if (!assignmentOrder || !rider?.rider_id) return;
    setActionLoading(true);
    try {
      await callApi('/order/updateorderstatus', {
        order_id: assignmentOrder.order_id,
        vendor_id: vendorId,
        rider_id: rider.rider_id,
        rider_name: rider.store_name,
        order_status: 1,
        assignment_mode: 'manual'
      });
      updateLocalOrderStatus(assignmentOrder.order_id, 1);
      await loadHomeDataSilent();
      setAssignRiderOpen(false);
      setAssignmentOrder(null);
    } catch (err) {
      setError(err?.message || 'Unable to assign rider');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (order) => {
    setOrderToReject(order);
    setRejectConfirmOpen(true);
  };

  const confirmReject = async () => {
    if (!orderToReject) return;

    setActionLoading(true);
    try {
      await updateOrderStatus(orderToReject.order_id, 3);
      updateLocalOrderStatus(orderToReject.order_id, 3);
      await loadHomeDataSilent();
      setRejectConfirmOpen(false);
      setOrderToReject(null);
    } catch (err) {
      setError(err?.message || 'Unable to reject order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReadyForPickup = (order) => {
    setSelectedOrder(order);
    setOtpValue('');
    setOtpOpen(true);
  };

  const submitOtpAndComplete = async () => {
    if (!selectedOrder) return;

    if (!/^\d{6}$/.test(otpValue)) {
      setError('OTP must be exactly 6 digits');
      return;
    }

    setActionLoading(true);
    try {
      // Call the OTP verification API
      await callApi('/order/verifyotprider', {
        order_id: selectedOrder.order_id,
        rider_id: selectedOrder.rider_id || selectedOrder.rider_unique_id || selectedOrder.riderId || '',
        entered_otp: otpValue
      }, 'POST');

      setOtpOpen(false);
      // Optimistically mark order as 'On the way' (status 2) after OTP verified
      updateLocalOrderStatus(selectedOrder.order_id, 2);
      await loadHomeDataSilent();
      // Optionally show a toast/notification here
    } catch (err) {
      setError(err?.message || 'Unable to verify OTP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStoreToggle = async () => {
    setStatusLoading(true);
    setError('');

    try {
      const targetStatus = storeOnline ? 0 : 1;
      await callApi('/vendors/vendor-status', {
        user_id: vendorId,
        role_id: 3,
        status: targetStatus
      });
      setStoreOnline(targetStatus === 1);
      setStoreProfile((prev) => ({ ...(prev || {}), status: targetStatus }));
    } catch (err) {
      setError(err?.message || 'Unable to update store status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadHomeData();
  };

  if (!ready) return null;

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p2" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
        <Card.Body className="bg-primary text-white" style={{ borderRadius: 16 }}>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div className="d-flex gap-3 align-items-start flex-grow-1">
              {/* Store Profile Image */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  minWidth: 80,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              >
                {storeProfile?.profile_pic || storeProfile?.store_image ? (
                  <img
                    src={storeProfile?.profile_pic || storeProfile?.store_image}
                    alt="Store"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling?.style?.removeProperty('display');
                    }}
                  />
                ) : null}
                {!storeProfile?.profile_pic && !storeProfile?.store_image && (
                  <div style={{ fontSize: '2rem', color: '#ccc' }}>🏪</div>
                )}
              </div>

              <div>
                <h4 className="mb-1 text-white">{storeProfile?.store_name || storeProfile?.name || 'Store Home'}</h4>
                <div className="text-white-50">{storeProfile?.address || storeProfile?.store_address || 'Address unavailable'}</div>
              </div>
            </div>
            <div>
              <Badge bg="light" text="dark">Notifications: {notifications.length}</Badge>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span>Store Status</span>
            <Button
              size="sm"
              variant={storeOnline ? 'success' : 'danger'}
              onClick={handleStoreToggle}
              disabled={statusLoading}
            >
              {statusLoading ? 'Updating...' : storeOnline ? 'Online' : 'Offline'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleRefresh} disabled={loading}>
          Refresh
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0 mb-3">
        <Card.Body>
          <h5 className="mb-3">Tracking Details</h5>
          <Row className="g-3">
            <Col md={4} sm={6}>
              <div><strong>Store ID</strong></div>
              <div>{storeProfile?.custom_id || '-'}</div>
            </Col>
            <Col md={4} sm={6}>
              <div><strong>Total Orders</strong></div>
              <div>{totalOrdersCount}</div>
            </Col>
            <Col md={4} sm={6}>
              <div><strong>Completed Orders</strong></div>
              <div>{completedOrdersCount}</div>
            </Col>
            <Col md={4} sm={6}>
              <div><strong>Cancelled Orders</strong></div>
              <div>{cancelledOrdersCount}</div>
            </Col>
            <Col md={4} sm={6}>
              <div><strong>Products</strong></div>
              <div>{productsCount}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex gap-2 mb-3">
        <Button variant={activeTab === 'new' ? 'success' : 'outline-secondary'} onClick={() => setActiveTab('new')}>
          New Orders ({filteredPrepareOrders.length})
        </Button>
        <Button variant={activeTab === 'completed' ? 'success' : 'outline-secondary'} onClick={() => setActiveTab('completed')}>
          Completed Orders ({filteredOrderReadyOrders.length})
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : searchedOrders.length === 0 ? (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h2 className="mb-0">No {activeTab === 'new' ? 'New' : 'Completed'} Orders</h2>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {searchedOrders.map((order) => {
            const status = safeNumber(order.order_status, -1);
            const isNullStatus = order.order_status == null;
            const canAccept = isNullStatus;
            const canReject = isNullStatus;
            const canReady = status === 1;

            return (
              <Card className="shadow-sm border-0" key={order.order_id}>
                <Card.Body>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <div><strong>Order ID: {order.order_uid || order.order_id}</strong></div>
                      <div>{order.name}</div>
                      <div className="text-muted small">{new Date(order.order_created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-end">
                      {order.is_fast_delivery ? <span className="badge bg-success-subtle text-success mb-1">Fast Delivery</span> : null}
                      <div><span className={`badge bg-${getStatusMeta(order.order_status).className}`}>{getStatusMeta(order.order_status).text}</span></div>
                      <div><strong>Rs. {order.price}</strong></div>
                      <div className="small text-muted">{order.payment_method}</div>
                    </div>
                  </div>

                  <div className="mb-2 small">
                    <div><strong>Customer:</strong> {order.name}</div>
                    <div><strong>Phone:</strong> {order.phone}</div>
                    <div><strong>Address:</strong> {order.address}</div>
                  </div>

                  <div className="small mb-2">
                    <div className="mb-1"><strong>Items:</strong></div>
                    {(order.items || []).map((item, index) => (
                      <div key={`${order.order_id}-${index}`}>
                        • {item.name} x {item.quantity}
                        {item.variant_value ? ` (${item.variant_value}${item.variant_type ? `, ${item.variant_type}` : ''})` : ''}
                        {Array.isArray(item.addons) && item.addons.length > 0 ? ` | Addons: ${item.addons.map((a) => a?.name || a?.addon_name || a).join(', ')}` : ''}
                        {' '} - Rs. {item.product_price}
                      </div>
                    ))}
                  </div>

                  <div className="small mb-2">
                    {order.is_fast_delivery ? <div><strong>Delivery Charges:</strong> Rs. {safeNumber(order.delivery_charge)}</div> : null}
                    <div><strong>Payment:</strong> {order.payment_method}</div>
                    <div><strong>Total:</strong> Rs. {safeNumber(order.price)}</div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {canAccept && (
                      <Button size="sm" variant="success" disabled={actionLoading} onClick={() => handleAccept(order)}>
                        Accept
                      </Button>
                    )}
                    {canReject && (
                      <Button size="sm" variant="outline-danger" disabled={actionLoading} onClick={() => handleReject(order)}>
                        Reject
                      </Button>
                    )}
                    {canReady && (
                      <Button size="sm" variant="primary" disabled={actionLoading} onClick={() => handleReadyForPickup(order)}>
                        Send Order
                      </Button>
                    )}
                    {safeNumber(order.order_status) === 2 ? (
                      <Button size="sm" variant="success" disabled>
                        Order Completed
                      </Button>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      <Modal show={otpOpen} onHide={() => setOtpOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Rider OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Enter 6 digit OTP"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            disabled={actionLoading || (selectedOrder && selectedOrder.is_verified)}
          />
          {selectedOrder && selectedOrder.is_verified ? (
            <div className="mt-2 text-success fw-bold">Pickup Verified</div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOtpOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" disabled={actionLoading || (selectedOrder && selectedOrder.is_verified)} onClick={submitOtpAndComplete}>
            Verify & Complete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={rejectConfirmOpen} onHide={() => setRejectConfirmOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reject this order? This action cannot be undone.</p>
          {orderToReject ? (
            <div className="small">
              <div><strong>Order ID:</strong> {orderToReject.order_uid || orderToReject.order_id}</div>
              <div className="text-muted">Customer: {orderToReject.name}</div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectConfirmOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmReject} disabled={actionLoading}>
            Reject Order
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={acceptChoiceOpen} onHide={() => setAcceptChoiceOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Accept Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            {/*
            <Button variant="success" disabled={actionLoading} onClick={handleSendToAllRiders}>
              Send to All Riders Automatically
            </Button>
            */}
            <Button variant="outline-primary" disabled={actionLoading} onClick={handleOpenManualAssign}>
              Assign Manually
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={assignRiderOpen} onHide={() => setAssignRiderOpen(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Assign Rider Manually</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignRidersLoading ? (
            <div className="d-flex justify-content-center py-4"><Spinner animation="border" /></div>
          ) : assignRidersError ? (
            <Alert variant="danger">{assignRidersError}</Alert>
          ) : availableRiders.length === 0 ? (
            <Alert variant="secondary" className="mb-0">No active riders found</Alert>
          ) : (
            <div className="d-flex flex-column gap-2">
              {availableRiders.map((rider) => (
                <Card key={rider.rider_id} className="border">
                  <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                      <div><strong>{rider.store_name}</strong></div>
                      <div className="text-muted small">ID: {rider.custom_id}</div>
                      <div className="text-muted small">Phone: {rider.phone}</div>
                    </div>
                    <Button variant="primary" disabled={actionLoading} onClick={() => handleAssignRider(rider)}>
                      Assign
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
