import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // <-- import useNavigate
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

const ShowAllProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- initialize navigate

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState([]); // track deleting product IDs

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      setDeletingIds((prev) => [...prev, id]); // mark as deleting
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`/api/products/${id}`);

      // Remove deleted product from list
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(
        err.response?.data?.message || "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to view products.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">All Products</h1>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-muted">
          No products found. Try adding one!
        </div>
      )}

      <Row className="g-4">
        {products.map((product) => {
          const isDeleting = deletingIds.includes(product._id);

          return (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                {product.photoUrl ? (
                  <Card.Img
                    variant="top"
                    src={product.photoUrl}
                    alt={product.name}
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                ) : (
                  <div
                    className="bg-secondary d-flex align-items-center justify-content-center"
                    style={{ height: "180px" }}
                  >
                    <span className="text-white">No Image</span>
                  </div>
                )}

                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="mb-2 text-muted">
                    Price: ${Number(product.price).toFixed(2)}
                  </Card.Text>
                  <Card.Text>Quantity: {product.quantity}</Card.Text>

                  <Button
                    variant="info"
                    className="mb-2"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View
                  </Button>

                  <Button
                    as={Link}
                    to={`/products/${product._id}/edit`}
                    variant="warning"
                    className="mb-2"
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    disabled={isDeleting}
                    onClick={() => handleDelete(product._id)}
                  >
                    {isDeleting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default ShowAllProducts;
