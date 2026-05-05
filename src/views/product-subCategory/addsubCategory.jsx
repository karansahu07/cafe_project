import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Select, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { getAllCategories } from "../../services/apiService";

const { Dragger } = Upload;
const { Option } = Select;

const AddSubCategory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  const handleLogoChange = info => {
    setError("");
    let newFileList = info.fileList.slice(-1); // Only keep the latest file
    setFileList(newFileList);
    const fileObj = newFileList[0]?.originFileObj;
    if (info.file.status === "removed" || !fileObj) {
      setFile(null);
      setPreview(null);
      return;
    }
    // Validate file type and size
    const isImage = fileObj.type.startsWith("image/");
    const isLt2M = fileObj.size / 1024 / 1024 < 2;
    if (!isImage) {
      setError("You can only upload image files!");
      setFileList([]);
      return;
    }
    if (!isLt2M) {
      setError("Image must be smaller than 2MB!");
      setFileList([]);
      return;
    }
    setFile(fileObj);
    setPreview(URL.createObjectURL(fileObj));
  };

  const handleFinish = async values => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category_id", values.category_id);
      if (file) {
        formData.append("subcategory_logo", file);
      }
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.post(`${API_URL}/subcategory/subcategories`, formData, config);
      setShowModal(true);
      form.resetFields();
      setFile(null);
      setPreview(null);
      setFileList([]);
    } catch (err) {
      setError("Failed to add sub-category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 650, margin: "40px auto" }}>
      <Card title="Add Product Sub-Category" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Sub-Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter sub-category name" }]}
          >
            <Input placeholder="Sub-Category Name" />
          </Form.Item>

          <Form.Item
            label="Parent Category"
            name="category_id"
            rules={[{ required: true, message: "Please select a parent category" }]}
          >
            <Select
              placeholder="-- Select Category --"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Sub-Category Description"
            name="description"
            rules={[{ required: true, message: "Please enter sub-category description" }]}
          >
            <Input.TextArea rows={5} placeholder="Enter sub-category description..." />
          </Form.Item>

          <Form.Item
            label="Sub-Category Logo"
            required
            rules={[{ required: true, message: "Please upload a logo" }]}
          >
            <Dragger
              name="subcategory_logo"
              accept="image/*"
              multiple={false}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleLogoChange}
              customRequest={() => {}}
              fileList={fileList}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined style={{ fontSize: 32 }} />
              </p>
              <p className="ant-upload-text">Click or drag image to this area to upload</p>
              <p className="ant-upload-hint">(Only image files, max 2MB)</p>
            </Dragger>
            {preview && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={preview}
                  alt="Logo Preview"
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
              </div>
            )}
          </Form.Item>

          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Add Sub-Category
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <h3>Sub-Category Created Successfully</h3>
          <p>The sub-category has been added successfully!</p>
          <Button type="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddSubCategory;
