import React from "react";
import { Table, Modal, Button, Form, Input, Select, Switch, Upload, message, Slider } from "antd";
import {  Pencil, Trash, Plus } from "react-bootstrap-icons";
import useBannerTable from "./bannerhook";
import AddBanner from "./addappbanner";
import UpdateBanner from "./updatebanner";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";

const { Option } = Select;
const { Dragger } = Upload;

const AllBanners = () => {
  const {
    banners,
    loading,
    error,
    pagination,
    show,
    selectedBanner,
    showDeleteModal,
    formState,
    previewImage,
    onTableChange,
    handleUpdate,
    handleDelete,
    handleClose,
    handleCloseDeleteModal,
    handleSave,
    confirmDelete,
    handleFormChange,
    handleImageChange,
    handleFeatureToggle,
    handleTodayDealToggle,
    handleStatusToggle, // <-- Add this handler in the hook
    fetchBanners, // <-- Add this to refresh after add
  } = useBannerTable();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  // Update cropper state
  const [updateCropOpen, setUpdateCropOpen] = React.useState(false);
  const [updateRawUrl, setUpdateRawUrl] = React.useState(null);
  const [updateCrop, setUpdateCrop] = React.useState({ x: 0, y: 0 });
  const [updateZoom, setUpdateZoom] = React.useState(1);
  const [updateCroppedPixels, setUpdateCroppedPixels] = React.useState(null);
  const UPDATE_ASPECT_RATIO = 157/64;

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Handler to refresh banners after add
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchBanners();
  };

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  // Filter banners by title
  const filteredBanners = React.useMemo(() => {
    if (!debouncedSearch) return banners;
    return banners.filter(b => b.title && b.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [banners, debouncedSearch]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Banner Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (img) =>
        img ? (
          <div style={{width:'fit-content'}} className=" border rounded  ">
          <img
            src={`${BASE_URL}${img}`}
            alt="Banner"
            style={{ width: 250, height: 100, objectFit: "contain" }}
          />
          </div>
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val, record) => (
        <Switch
          checked={val === 1}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => handleStatusToggle(record, checked)}
        />
      ),
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <Button
            type="text"
            icon={<Pencil className="text-primary" style={{  fontSize: 18 }} />}
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="text"
            icon={<Trash style={{ color: '#ff4d4f', fontSize: 18 }} />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
      width: 100,
    },
  ];

  const onUpdateCropComplete = React.useCallback((_, croppedPixels) => {
    setUpdateCroppedPixels(croppedPixels);
  }, []);

  const getCroppedBlob = (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        const { width, height, x, y } = cropPixels;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        }, "image/jpeg", 0.92);
      };
      image.onerror = reject;
      image.src = imageSrc;
    });
  };

  const openUpdateCropper = (pickedFile) => {
    const url = URL.createObjectURL(pickedFile);
    setUpdateRawUrl(url);
    setUpdateCrop({ x: 0, y: 0 });
    setUpdateZoom(1);
    setUpdateCroppedPixels(null);
    setUpdateCropOpen(true);
  };

  const confirmUpdateCrop = async () => {
    try {
      if (!updateRawUrl || !updateCroppedPixels) return;
      const croppedBlob = await getCroppedBlob(updateRawUrl, updateCroppedPixels);
      const compressedBlob = await imageCompression(croppedBlob, {
        maxSizeMB: 0.5,
        useWebWorker: true,
        maxWidthOrHeight: 2000,
      });
      const compressedFile = new File([compressedBlob], "banner.jpg", { type: "image/jpeg" });
      // use hook handler to set file and preview
      handleImageChange(compressedFile);
      setUpdateCropOpen(false);
      URL.revokeObjectURL(updateRawUrl);
      setUpdateRawUrl(null);
    } catch (err) {
      message.error("Failed to process image. Try another file.");
    }
  };

  const cancelUpdateCrop = () => {
    if (updateRawUrl) URL.revokeObjectURL(updateRawUrl);
    setUpdateRawUrl(null);
    setUpdateCropOpen(false);
  };

  return (
    <div className="p2 col-md-12">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Banners</h5>
        <Button type="primary" icon={<Plus />} onClick={() => setShowAddModal(true)}>
          Add New
        </Button>
      </div>
      <div className="mb-2">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
      </div>
      <div className="p-2 rounded bg-white">
        <Table
          columns={columns}
          dataSource={filteredBanners}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
          rowKey={record => record.id || record._id}
          // scroll={{ x: 'max-content' }}
          size="small" // Reduce row height
          rowClassName={() => 'custom-row-small'} // Custom class for row height
        />
      </div>
      {/* Add Banner Modal */}
      <Modal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        title="Add New Banner"
        footer={null}
        centered
        width={600}
      >
        <AddBanner onSuccess={handleAddSuccess} onCancel={() => setShowAddModal(false)} />
      </Modal>
      {/* Update Modal */}
      <Modal
        open={show}
        onCancel={handleClose}
        title="Update Banner"
        footer={null}
        centered
      >
        {selectedBanner && (
          <UpdateBanner
            banner={selectedBanner}
            onSuccess={() => { handleClose(); fetchBanners(); }}
            onCancel={handleClose}
          />
        )}
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        title="Confirm Deletion"
        onOk={confirmDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        centered
      >
        Are you sure you want to delete this banner?
      </Modal>
      <Modal
        open={updateCropOpen}
        onCancel={cancelUpdateCrop}
        onOk={confirmUpdateCrop}
        okText="Crop & Use"
        centered
        destroyOnClose
        width={700}
      >
        <div style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
          {updateRawUrl && (
            <Cropper
              image={updateRawUrl}
              crop={updateCrop}
              zoom={updateZoom}
              minZoom={0.5}
              maxZoom={3}
              aspect={UPDATE_ASPECT_RATIO}
              onCropChange={setUpdateCrop}
              onZoomChange={setUpdateZoom}
              onCropComplete={onUpdateCropComplete}
              restrictPosition={false}
              showGrid
            />
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 6 }}>Zoom</div>
          <Slider min={0.5} max={3} step={0.01} value={updateZoom} onChange={setUpdateZoom} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          Cropping to fixed aspect ratio. Final image will be compressed to ≤500KB.
        </div>
      </Modal>
    </div>
  );
};

export default AllBanners;
