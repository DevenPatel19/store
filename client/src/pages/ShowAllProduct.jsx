import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!user) {
    return (
      <Container className="py-4 text-center text-danger">
        You must be logged in to view products.
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">All Products</h2>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && products.length === 0 && (
        <div>No products found.</div>
      )}

      <Row>
        {products.map((product) => (
          <Col xs={12} md={6} lg={4} key={product._id} className="mb-4">
            <Card>
              {product.photoUrl && (
                <Card.Img
                  variant="top"
                  src={product.photoUrl}
                  alt={product.name}
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">SKU: {product.sku}</Card.Subtitle>
                <Card.Text>
                  <strong>Category:</strong> {product.category || "N/A"} <br />
                  <strong>Quantity:</strong> {product.quantity} <br />
                  <strong>Threshold:</strong> {product.threshold} <br />
                  <strong>Price:</strong> ${product.price.toFixed(2)} <br />
                  <strong>Barcodes:</strong> {product.barcodes || "N/A"}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductsList;
