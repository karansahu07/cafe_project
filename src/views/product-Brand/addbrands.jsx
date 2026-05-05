import React, { useState, useEffect } from "react";
import { Card, Modal } from "react-bootstrap";
import { getAllCategories, addProductBrand } from "../../services/apiService";
import { Form, Input, Button, Select, Upload, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Option } = Select;

const AddProductBrand = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                if (response.success) {
                    setCategories(response.data);
                } else {
                    message.error("Failed to fetch categories");
                }
            } catch (err) {
                message.error("Error fetching categories");
            }
        };
        fetchCategories();
    }, []);

    const handleLogoChange = info => {
        let newFileList = info.fileList.slice(-1);
        setFileList(newFileList);
        const fileObj = newFileList[0]?.originFileObj;
        if (info.file.status === "removed" || !fileObj) {
            setPreview(null);
            return;
        }
        setPreview(URL.createObjectURL(fileObj));
    };

    const handleFinish = async values => {
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("category_id", values.category_id);
            if (fileList[0]?.originFileObj) {
                formData.append("brand_logo", fileList[0].originFileObj);
            }
            const result = await addProductBrand(formData);
            if (result.success) {
                setShowModal(true);
                form.resetFields();
                setFileList([]);
                setPreview(null);
            } else {
                setError(result.error?.message || "Failed to add product brand.");
            }
        } catch (err) {
            setError("Failed to add product brand. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p2" style={{ maxWidth: 700, margin: "0 auto" }}>
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Product Brand</h4>
                    {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Brand Name"
                                    name="name"
                                    rules={[{ required: true, message: "Please enter brand name" }]}
                                >
                                    <Input placeholder="Brand Name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Select Product Category"
                                    name="category_id"
                                    rules={[{ required: true, message: "Please select a category" }]}
                                >
                                    <Select
                                        placeholder="-- Select Category --"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {categories.map((category) => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Brand Description"
                                    name="description"
                                    rules={[{ required: true, message: "Please enter brand description" }]}
                                >
                                    <Input.TextArea rows={5} placeholder="Enter brand description..." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Upload Brand Logo"
                                    required
                                >
                                    <Dragger
                                        name="brand_logo"
                                        accept="image/*"
                                        multiple={false}
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleLogoChange}
                                        fileList={fileList}
                                    >
                                        <p className="ant-upload-drag-icon"><PlusOutlined style={{ fontSize: 32 }} /></p>
                                        <p className="ant-upload-text">Click or drag image to this area to upload</p>
                                    </Dragger>
                                    {preview && (
                                        <div className="mt-3">
                                            <img
                                                src={preview}
                                                alt="Brand Logo Preview"
                                                style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, border: '1px solid #eee' }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                       
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: 200 }}>
                                Add Brand
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Product Brand Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The product brand has been added successfully!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddProductBrand;
