import React, { useRef, useState } from "react";
import { Input, Button, Form, Card, Space, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatPrice } from "../../../services/utils/gen_utility";

const { Text } = Typography;

const Addons = ({
  addons,
  editingAddonIdx,
  newAddonDraft,
  setNewAddonDraft,
  startEditAddon,
  saveEditAddon,
  cancelEditAddon,
  saveNewAddon,
  removeAddon
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const addFormRef = useRef();
  const editFormRef = useRef();

  const requiredRule = (label) => ({ required: true, message: `${label} is required` });

  const handleAdd = async () => {
    try {
      await addFormRef.current.validateFields();
      saveNewAddon();
      setShowAddForm(false);
      addFormRef.current.resetFields();
    } catch (err) {}
  };
  const handleEdit = async () => {
    try {
      await editFormRef.current.validateFields();
      saveEditAddon();
    } catch (err) {}
  };

  return (
    <div>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <Text strong style={{ fontSize: 16, marginBottom: 8, display: 'block' }}>Add-ons</Text>
        {/* Addons List */}
        {addons.length === 0 && <div style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>No add-ons added.</div>}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {addons.map((addon, idx) => (
            <Card
              key={idx}
              size="small"
              style={{ 
                background: editingAddonIdx === idx ? '#f6ffed' : '#fafafa',
                border: editingAddonIdx === idx ? '1px solid #52c41a' : '1px solid #f0f0f0',
                marginBottom: 0
              }}
              bodyStyle={{ padding: '4px' }}
            >
              {editingAddonIdx === idx ? (
                <Form
                  ref={editFormRef}
                  layout="vertical"
                  initialValues={newAddonDraft}
                  style={{ margin: 0 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[requiredRule('Name')]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        value={newAddonDraft.name}
                        onChange={e => setNewAddonDraft(d => ({ ...d, name: e.target.value }))}
                        placeholder="Name"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Price ($)"
                      name="price"
                      rules={[requiredRule('Price')]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newAddonDraft.price}
                        onChange={e => setNewAddonDraft(d => ({ ...d, price: e.target.value }))}
                      />
                    </Form.Item>
                    <Space>
                      <Button type="primary" size="small" onClick={handleEdit}>
                        Save
                      </Button>
                      <Button size="small" onClick={cancelEditAddon}>
                        Cancel
                      </Button>
                    </Space>
                  </div>
                </Form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size="large">
                    <div>
                      <Text strong>{addon.name}</Text>
                    </div>
                    <div>
                      <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                        {formatPrice(addon.price || 0)}
                      </Text>
                    </div>
                  </Space>
                  <Space>
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      size="small" 
                      onClick={() => startEditAddon(idx)}
                    >
                      Edit
                    </Button>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small" 
                      onClick={() => removeAddon(idx)}
                    >
                      Remove
                    </Button>
                  </Space>
                </div>
              )}
            </Card>
          ))}
          {/* Add Addon Button and Add Form */}
          {editingAddonIdx === null && (
            <>
              {!showAddForm ? (
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  // size="small" 
                  onClick={() => setShowAddForm(true)}
                  style={{ width: '100%' }}
                >
                  Add Addon
                </Button>
              ) : (
                <Card size="small" style={{ background: '#f6f6f6', border: '1px dashed #52c41a', marginTop: 8 }} bodyStyle={{ padding: 8 }}>
                  <Form
                    ref={addFormRef}
                    layout="vertical"
                    initialValues={newAddonDraft}
                    style={{ margin: 0 }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[requiredRule('Name')]}
                        style={{ margin: 0 }}
                      >
                        <Input
                          value={newAddonDraft.name}
                          onChange={e => setNewAddonDraft(d => ({ ...d, name: e.target.value }))}
                          placeholder="Name"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Price ($)"
                        name="price"
                        rules={[requiredRule('Price')]}
                        style={{ margin: 0 }}
                      >
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newAddonDraft.price}
                          onChange={e => setNewAddonDraft(d => ({ ...d, price: e.target.value }))}
                        />
                      </Form.Item>
                      <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
                        <Button type="primary" size="small" onClick={handleAdd}>Add</Button>
                        <Button size="small" onClick={() => setShowAddForm(false)}>Cancel</Button>
                      </div>
                    </div>
                  </Form>
                </Card>
              )}
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Addons;