import React, { useState } from 'react'
import { Table, Alert, Space, Button,Tag } from 'antd';
import dayjs from 'dayjs';
import useOrder, { getOrderStatus } from './hooks/useOrder';
import useVendors from './hooks/useVendors';
import SingleOrder from './SingleOrder';
import DateRangeSelector from '../../../components/DateRangeSelector';
import OrderFilters from './OrderFilters';
import useDebounce from '../../../hooks/useDebounce';
import styles from './orders.module.scss';

const Orders = () => {
  const {
    orders,
    total,
    page,
    limit,
    search,
    vendorId,
    status,
    dateRange,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
    setVendorId,
    setStatus,
    setDateRange,
  } = useOrder();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchInput, setSearchInput] = useState(search);
  
  const debouncedSearch = useDebounce(searchInput, 500); // 500ms debounce for search
  
  // Update the search state when debounced search changes
  React.useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);
  
  

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'User',
      dataIndex: ['user', 'custom_id'],
      key: 'user',
      render: (_, record) => record.user?.custom_id || '-',
    },
    {
      title: 'Vendor',
      dataIndex: ['vendor', 'store_name'],
      key: 'vendor',
      render: (_, record) => record.vendor?.store_name || '-',
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'Payment',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Status',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => {
        const s = getOrderStatus(status);
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedOrder(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  if (selectedOrder) {
    return <SingleOrder order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="p2"> 
      <h2>Orders</h2>
      <OrderFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={setSearch}
        vendorId={vendorId}
        onVendorChange={setVendorId}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        vendors={vendors}
        vendorsLoading={vendorsLoading}
      />
      {error && <Alert type="error" message="Error loading orders" description={error.message || String(error)} showIcon style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="order_id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50',"100","200","500"],
        }}
      />
    </div>
  );
}

export default Orders