import React from 'react';
import { Table, Button, Switch, Space, Modal, Form, Input, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import useCatagoryHook from './useCatagoryHook';

const { Dragger } = Upload;

const AllCategory = () => {
  const {
    data,
    loading,
    pagination,
    sorter,
    onTableChange,
    handleToggleActive,
    editModal,
    openEditModal,
    closeEditModal,
    selectedCategory,
    previewImage,
    handleImageChange,
    handleSave,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    search,
    setSearch,
  } = useCatagoryHook();

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // When opening edit modal, set form values
  React.useEffect(() => {
    if (editModal && selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory.name,
        description: selectedCategory.description,
        status: selectedCategory.status,
      });
    }
  }, [editModal, selectedCategory, form]);

  const expandedRowRender = record => (
    <div style={{ padding: 8 }}>
      <b>Description:</b> {record.description || 'No description'}
    </div>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'sr',
      key: 'sr',
      sorter: true,
      sortOrder: sorter.field === 'sr' ? sorter.order : null,
      width: 1,
    },
    {
      title: 'Logo',
      dataIndex: 'category_logo',
      key: 'category_logo',
      width: 100,
      render: (logo) =>
        logo && typeof logo == "string" ? (
          <img
            src={logo?.startsWith('http') ? logo : `${import.meta.env.VITE_IMAGE_BASE_URL}${logo}`}
            alt="Category Logo"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <span style={{ maxWidth: 200, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status === 1}
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

  // Handle edit form submit
  const onEditFinish = (values) => {
    handleSave({ ...selectedCategory, ...values });
  };

  return (
    <div className="p2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ margin: 0 }}>All Product Categories</h4>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/product-category/addCategory')}>
          Add Category
        </Button>
      </div>
      <div style={{ marginBottom: 16, maxWidth: 250 }}>
        <Input.Search
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
        />
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
          expandedRowRender,
          expandIconColumnIndex: 4, // after Description column (index 3)
        }}
      />
      {/* Edit Modal */}
      <Modal
        open={editModal}
        onCancel={closeEditModal}
        title="Edit Category"
        footer={null}
        destroyOnClose
        zIndex={2000}
      >
        {selectedCategory && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onEditFinish}
            initialValues={{
              name: selectedCategory.name,
              description: selectedCategory.description,
              status: selectedCategory.status,
            }}
          >
            <Form.Item label="Category Name" name="name" rules={[{ required: true, message: 'Please enter category name' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Category Logo">
              <Dragger
                name="file"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                beforeUpload={file => {
                  handleImageChange(file);
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload</p>
                <p className="ant-upload-text">Click or drag image to this area to upload</p>
              </Dragger>
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Category Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                </div>
              )}
            </Form.Item>
            <Form.Item label="Status" name="status" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                checked={form.getFieldValue('status') === 1}
                onChange={checked => form.setFieldsValue({ status: checked ? 1 : 0 })}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={closeEditModal} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={formLoading}>
                Save Changes
              </Button>
            </Form.Item>
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
      >
        Are you sure you want to delete this category?
      </Modal>
    </div>
  );
};

export default AllCategory;
