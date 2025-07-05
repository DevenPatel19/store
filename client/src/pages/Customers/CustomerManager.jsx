import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";  // <-- import useNavigate
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "../../api/axios.js";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

const CustomerManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();  // <-- initialize navigate

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Controlled form inputs for modal
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalStatus, setModalStatus] = useState("active");
  const [modalTags, setModalTags] = useState("");
  const [modalNotes, setModalNotes] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await axios.get("/api/customers");
      setCustomers(data);
      setError("");
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load customers. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenModal = (customer = null) => {
    setEditingCustomer(customer);

    // Set modal form fields for editing or clear for new
    setModalName(customer?.name || "");
    setModalEmail(customer?.contact?.email || "");
    setModalPhone(customer?.contact?.phone || "");
    setModalStatus(customer?.status || "active");
    setModalTags(customer?.tags?.join(", ") || "");
    setModalNotes(customer?.notes || "");

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setModalName("");
    setModalEmail("");
    setModalPhone("");
    setModalStatus("active");
    setModalTags("");
    setModalNotes("");
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();

    // Convert tags string to array
    const tagsArray = modalTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Construct payload with nested contact and other fields
    const customerData = {
      name: modalName,
      contact: {
        email: modalEmail,
        phone: modalPhone,
      },
      status: modalStatus,
      tags: tagsArray,
      notes: modalNotes,
    };

    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (editingCustomer) {
        await axios.put(`/api/customers/${editingCustomer._id}`, customerData);
      } else {
        await axios.post("/api/customers", customerData);
      }

      handleCloseModal();
      fetchCustomers();
    } catch (err) {
      console.error("Failed to save customer:", err);
      alert(
        err.response?.data?.message || "Could not save customer. Please try again."
      );
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`/api/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert(
        err.response?.data?.message || "Could not delete customer. Please try again."
      );
    }
  };

  if (!user) {
    return (
      <div className="text-center text-danger font-weight-bold mt-5">
        You must be logged in to view customers.
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Customer Manager</h2>

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

      {!loading && !error && customers.length === 0 && (
        <div className="text-center text-muted">
          No customers found. Try adding one!
        </div>
      )}

      {!loading && customers.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Notes</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.contact?.email || "-"}</td>
                <td>{customer.contact?.phone || "-"}</td>
                <td>{customer.status}</td>
                <td>{customer.tags?.join(", ") || "-"}</td>
                <td>{customer.notes || "-"}</td>
                <td className="text-center">
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/customers/${customer._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenModal(customer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCustomer ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveCustomer}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="modalName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                required
                placeholder="Customer name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={modalEmail}
                onChange={(e) => setModalEmail(e.target.value)}
                placeholder="Customer email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                type="text"
                value={modalPhone}
                onChange={(e) => setModalPhone(e.target.value)}
                placeholder="Customer phone"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lead">Lead</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalTags">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                name="tags"
                type="text"
                value={modalTags}
                onChange={(e) => setModalTags(e.target.value)}
                placeholder="e.g. vip, important, newsletter"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                name="notes"
                as="textarea"
                rows={3}
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Additional notes about this customer"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCustomer ? "Save Changes" : "Add Customer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CustomerManager;
