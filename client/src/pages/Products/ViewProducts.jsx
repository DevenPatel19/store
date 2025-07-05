import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

const ViewProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load product. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to view this product.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-muted mt-5">
        Product not found.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/products")}>
        &larr; Back to Products
      </Button>

      <Card>
        {product.photoUrl && (
          <Card.Img
            variant="top"
            src={product.photoUrl}
            alt={product.name}
            style={{ objectFit: "cover", maxHeight: "300px" }}
          />
        )}
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>
            <strong>Price:</strong> ${Number(product.price).toFixed(2)}
          </Card.Text>
          <Card.Text>
            <strong>Quantity:</strong> {product.quantity}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong> {product.description || "-"}
          </Card.Text>
          {/* Add any other product details you have */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewProduct;
