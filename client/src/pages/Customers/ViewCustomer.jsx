import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "../../api/axios.js";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

const ViewCustomer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get(`/api/customers/${id}`);
        setCustomer(data);
        setError("");
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load customer. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to view this customer.
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

  if (!customer) {
    return (
      <div className="text-center text-muted mt-5">
        Customer not found.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/customers")}>
        &larr; Back to Customer Manager
      </Button>

      <Card>
        <Card.Header as="h5">Customer Details</Card.Header>
        <Card.Body>
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Email:</strong> {customer.contact?.email || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {customer.contact?.phone || "-"}
          </p>
          <p>
            <strong>Status:</strong> {customer.status}
          </p>
          <p>
            <strong>Tags:</strong> {customer.tags?.length ? customer.tags.join(", ") : "-"}
          </p>
          <p>
            <strong>Notes:</strong> {customer.notes || "-"}
          </p>
          <p>
            <strong>Last Interaction:</strong>{" "}
            {customer.lastInteraction
              ? new Date(customer.lastInteraction).toLocaleDateString()
              : "-"}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewCustomer;
