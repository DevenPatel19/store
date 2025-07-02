import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";

const ProductForm = ({ mode = "add" }) => {
  const { id } = useParams(); // 👈 get :id from URL if in edit mode
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcodes: "",
    quantity: 0,
    threshold: 5,
    price: "",
    category: "",
    photoUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

  // Fetch product data when editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchProduct = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            name: data.name,
            sku: data.sku,
            barcodes: data.barcodes,
            quantity: data.quantity,
            threshold: data.threshold,
            price: data.price,
            category: data.category,
            photoUrl: data.photoUrl,
          });

          if (data.photoUrl) {
            setImagePreview(data.photoUrl);
          }
        } catch (err) {
          console.error("Failed to load product:", err);
          setError("Unable to load product data.");
        }
      };
      fetchProduct();
    }
  }, [mode, id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "photoUrl") {
      setImagePreview(value);
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        ...formData,
        sku: formData.sku.trim().toLowerCase(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
      };

      if (mode === "edit") {
        await axios.put(`/api/products/${id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }

      navigate("/products");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(
        err.response?.data?.message || `Failed to ${mode} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to {mode} a product.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={7} lg={6} xl={5}>
          <Form onSubmit={handleSubmit}>
            {[
              { label: "Product Name", field: "name", type: "text", required: true },
              { label: "SKU", field: "sku", type: "text", required: true },
              { label: "Barcode", field: "barcodes", type: "text" },
              { label: "Quantity", field: "quantity", type: "number", required: true },
              { label: "Low Stock Threshold", field: "threshold", type: "number" },
              { label: "Price ($)", field: "price", type: "number", required: true },
              { label: "Category", field: "category", type: "text" },
              { label: "Photo URL", field: "photoUrl", type: "text" },
            ].map(({ label, field, type, required }) => (
              <Form.Group controlId={field} className="mb-3" key={field}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  value={formData[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required={required}
                  min={type === "number" ? 0 : undefined}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />

                {field === "photoUrl" && imagePreview && (
                  <div className="mt-3">
                    <div className="border rounded p-2 bg-light text-center">
                      {imageError ? (
                        <div className="text-danger py-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mb-2" height="40" width="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.94 20h14.12c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 17c-.77 1.33.19 3 1.6 3z"/>
                          </svg>
                          <div>Could not load image. Please check the URL.</div>
                        </div>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="img-fluid"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                          onError={handleImageError}
                        />
                      )}
                    </div>
                  </div>
                )}
              </Form.Group>
            ))}

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {mode === "edit" ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  mode === "edit" ? "Save Changes" : "Add Product"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
