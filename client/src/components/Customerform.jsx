import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

const CustomerForm = ({ mode = "add", id }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
    status: "active",
    tags: [],
    notes: "",
    lastInteraction: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // For initial fetch loading

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchCustomer = async () => {
        setFetching(true);
        try {
          const token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          const { data } = await axios.get(`/api/customers/${id}`);
          console.log("Fetched customer data:", data);

          setFormData({
            name: data.name || "",
            contact: {
              email: data.contact?.email || "",
              phone: data.contact?.phone || "",
            },
            status: data.status || "active",
            tags: data.tags || [],
            notes: data.notes || "",
            lastInteraction: data.lastInteraction
              ? new Date(data.lastInteraction).toISOString().split("T")[0]
              : "",
          });
        } catch (err) {
          console.error("Failed to load customer:", err);
          setError("Unable to load customer data.");
        } finally {
          setFetching(false);
        }
      };
      fetchCustomer();
    }
  }, [mode, id]);

  const handleInputChange = (field, value, isContact = false) => {
    if (isContact) {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTagsChange = (value) => {
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
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
        name: formData.name,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone,
        },
        status: formData.status,
        tags: formData.tags,
        notes: formData.notes,
        lastInteraction: formData.lastInteraction || undefined,
      };

      if (mode === "edit") {
        await axios.put(`/api/customers/${id}`, payload);
      } else {
        await axios.post("/api/customers", payload);
      }

      navigate("/customers");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${mode} customer. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to {mode} a customer.
      </div>
    );
  }

  if (mode === "edit" && fetching) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={7} lg={6} xl={5}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="Enter customer name"
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  handleInputChange("email", e.target.value, true)
                }
                placeholder="Enter email address"
              />
            </Form.Group>

            <Form.Group controlId="phone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.contact.phone}
                onChange={(e) =>
                  handleInputChange("phone", e.target.value, true)
                }
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group controlId="status" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lead">Lead</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="tags" className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="e.g. vip, important, newsletter"
              />
            </Form.Group>

            <Form.Group controlId="lastInteraction" className="mb-3">
              <Form.Label>Last Interaction</Form.Label>
              <Form.Control
                type="date"
                value={formData.lastInteraction}
                onChange={(e) =>
                  handleInputChange("lastInteraction", e.target.value)
                }
              />
            </Form.Group>

            <Form.Group controlId="notes" className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this customer"
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {mode === "edit" ? "Saving..." : "Adding..."}
                  </>
                ) : mode === "edit" ? (
                  "Save Changes"
                ) : (
                  "Add Customer"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerForm;
