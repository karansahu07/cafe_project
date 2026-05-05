import React from "react";
import { Table, Input, Select, Button, Space, Modal, Form, Upload, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useBrandHook from "./usebrandhook";
import "../../assets/scss/pages/productbrand.scss"
const { Option } = Select;

const AllBrands = () => {
  const {
    data,
    loading,
    error,
    pagination,
    sorter,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    onTableChange,
    editModal,
    openEditModal,
    closeEditModal,
    selectedBrand,
    previewImage,
    handleImageChange,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleEditSave,
    handleDelete, 
    updateStatus,
  } = useBrandHook();

  const [form] = Form.useForm();
  const [editFileList, setEditFileList] = React.useState([]);
  const [editPreview, setEditPreview] = React.useState("");

  React.useEffect(() => {
    if (editModal && selectedBrand) {
      setEditPreview(previewImage);
      setEditFileList([]);
      form.setFieldsValue({
        name: selectedBrand.name,
        description: selectedBrand.description,
        categoryid: selectedBrand.categoryid,
        status: selectedBrand.status === 1,
      });
            }
  }, [editModal, selectedBrand, previewImage, form]);

  const handleEditLogoChange = info => {
    let newFileList = info.fileList.slice(-1);
    setEditFileList(newFileList);
    const fileObj = newFileList[0]?.originFileObj;
    if (info.file.status === "removed" || !fileObj) {
      setEditPreview("");
      handleImageChange(null);
      return;
    }
    setEditPreview(URL.createObjectURL(fileObj));
    handleImageChange(fileObj);
  };

  // Add status toggle handler
  const handleToggleActive = (brandId, isActive) => {
    // You can implement this in the hook for API update if needed
    // For now, just update local state
    // Optionally, call an API to persist
    // setData(prev => prev.map(b => b.id === brandId ? { ...b, status: isActive ? 1 : 0 } : b));
    // For now, just call handleEditSave with status change
    console.log(brandId, isActive,data);
    
    const brand = data.find(b => b.id === brandId);
    console.log(brand);
    
    if (brand) {
      updateStatus(brandId, isActive);
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'sr',
      key: 'sr',
      width: 60,
      render: (_, __, idx) => (pagination.current - 1) * pagination.pageSize + idx + 1,
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      // The expand icon will appear before this column by default
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 280,
      render: (text) => (
        <span style={{ maxWidth: 280, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: true,
    },
    {
      title: 'Logo',
      dataIndex: 'brand_logo',
      key: 'brand_logo',
      width: 100,
      render: (logo) =>
        logo ? (
          <img
            src={logo.startsWith('http') ? logo : `${import.meta.env.VITE_IMAGE_BASE_URL}${logo}`}
            alt="Brand Logo"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
          />
                  ) : (
                    <span>No Image</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={checked => handleToggleActive(record.id, checked ? 1 : 0)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => openDeleteModal(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p2">
      <h4 style={{ marginBottom: 16 }}>All Brands</h4>
      <div style={{ marginBottom: 16 }}>
        <div className="row g-2">
          <div className="col-12 col-md-2">
            <Input.Search
              placeholder="Search brands"
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-12 col-md-2">
            <Select
              placeholder="Filter by Category"
              value={categoryFilter || undefined}
              onChange={val => setCategoryFilter(val)}
              allowClear
              showSearch
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={onTableChange}
        rowKey={record => record.id}
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: record => (
            <div style={{ padding: 8 }}>
              <b>Description:</b> {record.description || 'No description'}
            </div>
          ),
          
          expandIconColumnIndex: 2, // expand icon before Brand Name
        }}
        
      />
      {/* Edit Modal */}
      <Modal
        open={editModal}
        onCancel={closeEditModal}
        title="Edit Brand"
        footer={null}
        destroyOnClose
        width={700}
        zIndex={2000}
      >
        {selectedBrand && (
          <Form
            form={form}
            layout="vertical"
            onFinish={values => handleEditSave(values, editFileList[0]?.originFileObj)}
            initialValues={{
              name: selectedBrand.name,
              description: selectedBrand.description,
              categoryid: selectedBrand.categoryid,
              status: selectedBrand.status === 1,
            }}
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 col-md-6">
                  <Form.Item label="Brand Name" name="name" rules={[{ required: true, message: 'Please enter brand name' }]}> 
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6">
                  <Form.Item label="Category" name="categoryid" rules={[{ required: true, message: 'Please select a category' }]}> 
                    <Select
                      placeholder="Select Category"
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                  ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <Form.Item label="Description" name="description">
                    <Input.TextArea rows={5} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6">
                  <Form.Item label="Brand Logo">
                    <Upload.Dragger
                      name="file"
                      accept="image/*"
                      multiple={false}
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleEditLogoChange}
                      fileList={editFileList}
                    >
                      <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload</p>
                      <p className="ant-upload-text">Click or drag image to this area to upload</p>
                    </Upload.Dragger>
                    {editPreview && (
                  <div className="mt-2">
                        <img src={editPreview} alt="Brand Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  </div>
                )}
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex justify-content-end gap-2">
                  <Button onClick={closeEditModal} style={{ marginRight: 8 }}>
            Cancel
          </Button>
                  <Button type="primary" htmlType="submit" loading={formLoading}>
            Save Changes
          </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={deleteModal}
        onCancel={closeDeleteModal}
        title="Confirm Deletion"
        onOk={handleDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        confirmLoading={formLoading}
        zIndex={2000}
      >
        Are you sure you want to delete this brand?
      </Modal>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default AllBrands;
