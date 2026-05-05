import React from "react";
import { Table, Input, Select, Switch, Button, Space, Modal, Form, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useSubcategoryHook from "./usesubcatagory";

const { Option } = Select;

const AllSubCategory = () => {
  const {
    data,
    loading,
    error,
    pagination,
    sorter,
    search,
    setSearch,
    parentFilter,
    setParentFilter,
    categories,
    onTableChange,
    handleToggleActive,
    editModal,
    openEditModal,
    closeEditModal,
    selectedSubcategory,
    previewImage,
    handleImageChange,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleEditSave,
    handleDelete,
    statusLoading,
    deleteLoading,
  } = useSubcategoryHook();

  const [form] = Form.useForm();
  const [editFileList, setEditFileList] = React.useState([]);
  const [editPreview, setEditPreview] = React.useState("");

  React.useEffect(() => {
    if (editModal && selectedSubcategory) {
      setEditPreview(previewImage);
      setEditFileList([]);
      form.setFieldsValue({
        name: selectedSubcategory.name,
        description: selectedSubcategory.description,
        category_id: selectedSubcategory.category_id,
        status: selectedSubcategory.status === 1,
      });
    }
  }, [editModal, selectedSubcategory, previewImage, form]);

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
      width: 60,
      render: (_, __, idx) => (pagination.current - 1) * pagination.pageSize + idx + 1,
    },
    {
      title: 'Subcategory Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <span style={{ maxWidth: 180, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: 'Logo',
      dataIndex: 'subcategory_logo',
      key: 'subcategory_logo',
      width: 100,
      render: (logo) =>
        logo ? (
          <img
            src={logo.startsWith('http') ? logo : `${import.meta.env.VITE_IMAGE_BASE_URL}${logo}`}
            alt="Subcategory Logo"
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
          loading={statusLoading[record?.id]}
          onChange={checked => handleToggleActive(record.id, checked ? 1 : 0)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
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
      <h4 style={{ marginBottom: 16 }}>All Product Subcategories</h4>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search subcategories"
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 220 }}
        />
        <Select
          placeholder="Filter by Category"
          value={parentFilter || undefined}
          onChange={val => setParentFilter(val)}
          allowClear
          showSearch
          style={{ width: 220 }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
          ))}
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={onTableChange}
        rowKey={record => record?.id}
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender,
          expandIconColumnIndex: 4, // after Description column (index 2)
        }}
      />
      {/* Edit Modal */}
      <Modal
        open={editModal}
        onCancel={closeEditModal}
        title="Edit Subcategory"
        footer={null}
        zIndex={2000}

        destroyOnClose
      >
          {selectedSubcategory && (
          <Form
            form={form}
            layout="vertical"
            onFinish={values => handleEditSave(values, editFileList[0]?.originFileObj)}
            initialValues={{
              name: selectedSubcategory.name,
              description: selectedSubcategory.description,
              category_id: selectedSubcategory.category_id,
              status: selectedSubcategory.status === 1,
            }}
          >
            <Form.Item label="Subcategory Name" name="name" rules={[{ required: true, message: 'Please enter subcategory name' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Parent Category" name="category_id" rules={[{ required: true, message: 'Please select a parent category' }]}> 
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
            <Form.Item label="Subcategory Logo">
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
                  <img src={editPreview} alt="Subcategory Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  </div>
                )}
            </Form.Item>
            <Form.Item label="Status" name="status" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
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
        confirmLoading={deleteLoading}
        zIndex={2000}

      >
        Are you sure you want to delete this subcategory?
            </Modal>
      {/* Error display */}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default AllSubCategory;
