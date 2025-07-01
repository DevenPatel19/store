import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

const ShowOne = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2 align-self-center">Loading...</span>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">{product.name}</Card.Title>
          <Card.Text><strong>SKU:</strong> {product.sku}</Card.Text>
          <Card.Text><strong>Barcodes:</strong> {product.barcodes}</Card.Text>
          <Card.Text><strong>Quantity:</strong> {product.quantity}</Card.Text>
          <Card.Text><strong>Low Stock Threshold:</strong> {product.threshold}</Card.Text>
          <Card.Text><strong>Price:</strong> ${product.price}</Card.Text>
          <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
          {product.photoUrl && (
            <Card.Img
              variant="bottom"
              src={product.photoUrl}
              alt={product.name}
              className="mt-3 rounded"
              style={{ objectFit: "contain", maxHeight: "300px" }}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ShowOne;
