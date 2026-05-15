import React from 'react';
import { Table, Input, Space, Avatar, Button, Badge, Switch, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { convertTimeRange, formatPhone } from '../../../services/utils/gen_utility';
import useRider from './hooks/useRider';

export default function VendorTable() {
  const navigate = useNavigate();
  const {
    vendors,
    loading,
    search,
    page,
    pageSize,
    total,
    onSearch,
    onPageChange,
    handleToggleStatus,
  } = useRider();

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srno',
      width: 60,
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
      align: 'center',
    },
    {
      title: 'Image',
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      render: (img) => <Avatar size={45} src={img} alt="store" />,
      width: 50,
    },
    {
      title: 'Rider Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        //firstname+lastname and first lertter of each word capital 
        <div style={{ minWidth: 180 }}>
          <b>{  record.firstname + ' ' + record.lastname ? record.firstname.charAt(0).toUpperCase() + record.firstname.slice(1) + ' ' + record.lastname.charAt(0).toUpperCase() + record.lastname.slice(1) : ''}</b>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 400, marginTop: 2 ,textDecoration: 'italic'}}>
            { record.username || ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Rider ID',
      dataIndex: 'custom_id',
      key: 'customId',
      width: 140,
      render: (text) => <span style={{ minWidth: 120, display: 'inline-block',fontSize: 12 }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      render: (status) => (
        <Tag
          color={status === 1 ? 'green' : 'error'}
          style={{ minWidth: 50, textAlign: 'center' }}
        >
          {status === 1 ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Vehicle Number',
      dataIndex: 'vehicle_registration_number',
      key: 'vehicle_registration_number',
      width: 140,
      // render: (timing,row) => <span style={{ minWidth: 120, display: 'inline-block' }}>{row?.vendor_start_time && row.vendor_close_time && convertTimeRange(row.vendor_start_time, row.vendor_close_time) || '-'}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phonenumber',
      key: 'Phone',
      width: 160,
      render: (number, record) => formatPhone(number, record.prefix),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'Email',
      width: 180,
      render: (text) => <span style={{ minWidth: 120, display: 'inline-block' }}>{text}</span>,
    },
    // Address column removed, address shown under Store Name
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',

      key: 'Status',
      render: (_, record) => (
        <Tooltip title={record.status === 1 ? 'Set Inactive' : 'Set Active'}>
          <Switch
            checked={record.status === 1}
            // onChange={...} // TODO: implement status toggle handler
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={checked => handleToggleStatus(record.rider_id, checked ? 1 : 0)}

          />
        </Tooltip>)
    },
    {
      title: 'Action',
      key: 'action',
      // width: 180,
      align: 'center',
      render: (_, record) => (
        // </Space>
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/riders/${record.rider_id}`)}
            >view</Button>
          </Tooltip>
        
      ),
    },
  ];

  return (
    <div className='p2'>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Store Name"
          value={search.storeName}
          onChange={e => onSearch('storeName', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
        <Input
          placeholder="Search Store ID"
          value={search.customId}
          onChange={e => onSearch('customId', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={vendors}
        loading={loading}
        size="small"
        rowKey="storeid"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
        scroll={{ x: 'max-content', y: "67vh" }} // Enable both horizontal and vertical scroll
        className="custom-pagination-bg"
        // bordered
      />
      {/* Custom style for pagination background */}
      <style>{`
        .custom-pagination-bg .ant-table-pagination {
          background: #fff !important;
          padding: 12px 16px;
          margin:0 !important;
          border-radius: 0 0 8px 8px;
        }
      `}</style>
    </div>
  );
}
