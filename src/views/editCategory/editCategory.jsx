import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { getAllCategories, saveproductCategories, getShowSelectedCategory } from "../../services/apiService";

const CategorySelector = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory1, setSelectedCategory1] = useState("");
    const [selectedCategory2, setSelectedCategory2] = useState("");
    const [selectedCategory3, setSelectedCategory3] = useState("");
    const [selectedCategory4, setSelectedCategory4] = useState("");
    const [selectedCategory5, setSelectedCategory5] = useState("");
    const [selectedCategory6, setSelectedCategory6] = useState("");
    const [selectedCategory7, setSelectedCategory7] = useState("");
    const [selectedCategory8, setSelectedCategory8] = useState("");
    const [selectedCategory9, setSelectedCategory9] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch categories first
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                if (response.success) {
                    setCategories(response.data);
                } else {
                    console.error("Failed to fetch categories:", response.error);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length === 0) return; // Ensure categories are loaded before fetching selected categories

        const fetchSelectedCategories = async () => {
            try {
                for (let index = 1; index <= 9; index++) {
                    const response = await getShowSelectedCategory(index);
                    if (response.success && response.data) {
                        const categoryId = String(response.data.id); // Ensure ID is stored as a string
                        if (index === 1) setSelectedCategory1(categoryId);
                        if (index === 2) setSelectedCategory2(categoryId);
                        if (index === 3) setSelectedCategory3(categoryId);
                        if (index === 4) setSelectedCategory4(categoryId);
                        if (index === 5) setSelectedCategory5(categoryId);
                        if (index === 6) setSelectedCategory6(categoryId);
                        if (index === 7) setSelectedCategory7(categoryId);
                        if (index === 8) setSelectedCategory8(categoryId);
                        if (index === 9) setSelectedCategory9(categoryId);
                    }
                }
            } catch (err) {
                console.error("Error fetching selected categories:", err);
            }
        };

        fetchSelectedCategories();
    }, [categories]); // Fetch selected categories only after categories are loaded

    // Function to update only one category at a time
    const handleSaveCategory = async (category, index) => {
        if (!category) return;

        try {
            await saveproductCategories(category, index);

            setShowModal(true);
            setModalMessage(`Category for Section ${index} updated successfully!`);

            // Update selected category state
            if (index === 1) setSelectedCategory1(category);
            if (index === 2) setSelectedCategory2(category);
            if (index === 3) setSelectedCategory3(category);
            if (index === 4) setSelectedCategory4(category);
            if (index === 5) setSelectedCategory5(category);
            if (index === 6) setSelectedCategory6(category);
            if (index === 7) setSelectedCategory7(category);
            if (index === 8) setSelectedCategory8(category);
            if (index === 9) setSelectedCategory9(category);
        } catch (err) {
            setError("Failed to save category. Please try again.");
        }
    };

    return (
        <Container>
            <h4 className="text-center mt-4">Select Categories</h4>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 1</Form.Label>
                        <Form.Select 
                            value={selectedCategory1} 
                            onChange={(e) => setSelectedCategory1(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory1, 1)} 
                        variant="primary" 
                        className="mt-2"
                        disabled={!selectedCategory1}
                    >
                        Save Category 1
                    </Button>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 2</Form.Label>
                        <Form.Select 
                            value={selectedCategory2} 
                            onChange={(e) => setSelectedCategory2(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory2, 2)} 
                        variant="success" 
                        className="mt-2"
                        disabled={!selectedCategory2}
                    >
                        Save Category 2
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 3</Form.Label>
                        <Form.Select 
                            value={selectedCategory3} 
                            onChange={(e) => setSelectedCategory3(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory3, 3)} 
                        variant="warning" 
                        className="mt-2"
                        disabled={!selectedCategory3}
                    >
                        Save Category 3
                    </Button>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 4</Form.Label>
                        <Form.Select 
                            value={selectedCategory4} 
                            onChange={(e) => setSelectedCategory4(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory4, 4)} 
                        variant="danger" 
                        className="mt-2"
                        disabled={!selectedCategory4}
                    >
                        Save Category 4
                    </Button>
                </Col>
            </Row>

            <div className="my-4 p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
                <h4 className="text-center text-muted mb-0">
                    Select Categories for the Category Page
                </h4>
            </div>


            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 5</Form.Label>
                        <Form.Select 
                            value={selectedCategory5} 
                            onChange={(e) => setSelectedCategory5(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory5, 5)} 
                        variant="info" 
                        className="mt-2"
                        disabled={!selectedCategory5}
                    >
                        Save Category 5
                    </Button>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 6</Form.Label>
                        <Form.Select 
                            value={selectedCategory6} 
                            onChange={(e) => setSelectedCategory6(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory6, 6)} 
                        variant="dark" 
                        className="mt-2"
                        disabled={!selectedCategory6}
                    >
                        Save Category 6
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 7</Form.Label>
                        <Form.Select 
                            value={selectedCategory7} 
                            onChange={(e) => setSelectedCategory7(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory7, 7)} 
                        variant="secondary" 
                        className="mt-2"
                        disabled={!selectedCategory7}
                    >
                        Save Category 7
                    </Button>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 8</Form.Label>
                        <Form.Select 
                            value={selectedCategory8} 
                            onChange={(e) => setSelectedCategory8(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory8, 8)} 
                        variant="outline-primary" 
                        className="mt-2"
                        disabled={!selectedCategory8}
                    >
                        Save Category 8
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category for Section 9</Form.Label>
                        <Form.Select 
                            value={selectedCategory9} 
                            onChange={(e) => setSelectedCategory9(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button 
                        onClick={() => handleSaveCategory(selectedCategory9, 9)} 
                        variant="outline-success" 
                        className="mt-2"
                        disabled={!selectedCategory9}
                    >
                        Save Category 9
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Category Updated</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CategorySelector;
