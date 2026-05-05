import React, { useState } from "react";
import { Form, Input, Button, Upload, Modal, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addCategory } from "../../services/apiService";

const { Dragger } = Upload;

const AddCategory = () => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      if (file) {
        formData.append("category_logo", file);
      }
      const result = await addCategory(formData);
      if (result.success) {
        setShowModal(true);
        form.resetFields();
        setFile(null);
        setPreview(null);
        setFileList([]);
      } else {
        setError(result.error?.message || "Failed to add category.");
      }
    } catch (err) {
      setError("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Card title="Add Product Category" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>

          <Form.Item
            label="Category Description"
            name="description"
            rules={[{ required: true, message: "Please enter category description" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter category description..." />
          </Form.Item>

          <Form.Item
            label="Category Logo"
            required
            rules={[{ required: true, message: "Please upload a logo" }]}
          >
            <Dragger
              name="category_logo"
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
              Add Category
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
          <h3>Category Created Successfully</h3>
          <p>The category has been added successfully!</p>
          <Button type="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddCategory;
