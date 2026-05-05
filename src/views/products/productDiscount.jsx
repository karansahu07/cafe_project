import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import {
  getAllDiscounts,
  getAllProducts,
  saveOrUpdateDiscount,
  deleteDiscount,
} from "../../services/apiService";

const ProductDiscountList = () => {

  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [discountRes, productRes] = await Promise.all([
        getAllDiscounts(),
        getAllProducts(),
      ]);

      if (discountRes.success) setDiscounts(discountRes.data);
      if (productRes.success) setProducts(productRes.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (discount = null) => {
    setSelected(discount || { product_id: "", discount_percent: "" });
    setShowModal(true);
  };

  const saveDiscount = async () => {
    const res = await saveOrUpdateDiscount(selected);
    if (res.success) {
      setShowModal(false);
      const updated = await getAllDiscounts();
      if (updated.success) setDiscounts(updated.data);
    } else {
      console.error("Save failed:", res.error);
    }
  };

  const confirmDelete = async (id) => {
    console.log(id)
    const res = await deleteDiscount(id);
    if (res.success) {
      const updated = await getAllDiscounts();
      if (updated.success) setDiscounts(updated.data);
    } else {
      console.error("Delete failed:", res.error);
    }
  };
  return (
    <Container className="p-4">
      <Row className="mb-4">
        <Col>
          <h4 className="fw-bold text-primary">Product Discounts</h4>
          <Button className="custom-toggle active-green" onClick={() => openModal()}>
            + New Discount
          </Button>
        </Col>
      </Row>

      <div className="table-responsive p-2 bg-white">
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Discount %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d, i) => (
              <tr key={d.id}>
                <td>{i + 1}</td>
                <td>{d.name}</td>
                <td>{d.discount_percent}%</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => openModal(d)}>
                    <Pencil />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => confirmDelete(d.discount_id)}>
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selected?.id ? "Update" : "Add"} Discount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product</Form.Label>
                <Form.Select
                  name="product_id"
                  value={selected.product_id}
                  onChange={handleChange}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="discount_percent"
                  value={selected.discount_percent}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveDiscount}>
            {selected?.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDiscountList;
