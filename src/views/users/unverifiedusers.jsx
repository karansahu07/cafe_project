import React from "react";
import { Table, Button, Input, Space, Tag } from "antd";
import useUnverifiedUsers from "./unverifieduserhook";
import UserPreview from "./components/UserPreview";
import { formatPhone } from "../../services/utils/gen_utility";

const UnverifiedUsers = ({user="vendors"}) => {
  const {
    userType,
    setUserType,
    loading,
    search,
    setSearch,
    filteredUsers,
    showViewModal,
    selectedUser,
    handleView,
    handleApprove,
    handleReject,
    handleCloseModal,
    getBadgeStatus,
    viewLoading,
  } = useUnverifiedUsers(user);   

  

  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: userType === "vendors"?"Vendor Name":"Rider Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <div>
          <span style={{ fontWeight: "bold" }}>
            {userType === "vendors"
              ? user.storename || `${user.firstname} ${user.lastname}`
              : `${user.firstname} ${user.lastname}`}
          </span>
          <br />
          <span style={{ color: "#888", fontSize: 12 }}>
            {userType === "vendors" ? user.address : user.address || "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
      // render: (_, user) => `${user.prefix || ''} ${user.phonenumber}`,
      render: (_, user) => formatPhone(user.phonenumber, user.prefix),
    },
    {
      title: "Is Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (val) => {
        const badge = getBadgeStatus(val);
        return <Tag color={badge.color}  >{badge.text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <Space>
          <Button type="link" onClick={() => handleView(user)} disabled={user.is_verified === 1}>
            View
          </Button>
          <Button type="link" danger onClick={() => handleReject(user)} disabled={user.is_verified === 1}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div id="preview-root" style={{ position: 'relative' }} className="p2">
      <h4>Unverified {userType== "vendors"?"Vendors":"Rider"}</h4>
      {/* <div className="mb-3">
        <Button
          type={userType === "vendors" ? "primary" : "default"}
          onClick={() => setUserType("vendors")}
          style={{ marginRight: 8 }}
        >
          Unverified Vendors
        </Button>
        <Button
          type={userType === "delivery_partners" ? "primary" : "default"}
          onClick={() => setUserType("delivery_partners")}
        >
          Unverified Delivery Partners
        </Button>
      </div> */}
      <div className="mb-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey={record => record.user_id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      {/* View Drawer now handled inside UserPreview */}
      {selectedUser ? (
        <UserPreview 
          user={selectedUser} 
          userType={userType} 
          loading={viewLoading} 
          open={showViewModal}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ) : null}
    </div>
  );
};

export default UnverifiedUsers;
